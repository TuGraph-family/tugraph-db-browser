import {
  getUserInfo,
  listRoles,
  listUsers,
  createUser,
  queryCyphers,
  queryCreateCyphers,
  createRole,
  modRoleAccessLevel,
  modRoleDesc,
} from '@/queries/security';
import { userInfoTranslator, convertPermissions } from '@/utils';
import { createGraph } from '@/queries/graph';
import { Driver } from 'neo4j-driver';
import { request } from '@/services/request';
import { importSchema } from '@/services/schema';
import { importData } from '@/services/info';
import { FileSchema, IRoleParams, IUserParams, Schema, SchemaProperty } from '@/types/services';

/* 获取用户列表 */
export const queryUsers = async (
  driver: Driver,
  params: { username?: string },
) => {
  const { username } = params;
  // 1、列出所有用户
  const cypherQuery = username ? getUserInfo(username) : listUsers();
  const userResult = await request({ driver, cypher: cypherQuery });
  if (!userResult?.success) {
    return userResult;
  }
  // 2、列出所有角色
  const roleResult = await request({ driver, cypher: listRoles() });

  if (!roleResult?.success) {
    return roleResult;
  }

  const result = userInfoTranslator(userResult?.data, roleResult?.data);

  return {
    success: true,
    code: 200,
    data: result,
  };
};

/* 创建用户 */
export const queryCreateUser = async (
  driver: Driver,
  params: IUserParams,
): Promise<any> => {
  try {
    const { username, password, description = '', roles = [] } = params;
    // 1.创建用户
    const createResult = await request({
      driver,
      cypher: createUser(username, password),
    });
    if (!createResult?.success) {
      return createResult;
    }

    const cypherScripts = queryCreateCyphers(
      username,
      description,
      JSON.stringify(roles),
    );

    const cypherPromise = cypherScripts.map(async cypher => {
      return await request({ driver, cypher });
    });
    const result = await Promise.all(cypherPromise);
    const error = result?.find(d => !d?.success);

    if (error) {
      return error;
    }

    return result[0];
  } catch (error) {
    return error;
  }
};

/* 编辑用户 */
export const updateUser = async (
  driver: Driver,
  params: IUserParams,
): Promise<any> => {
  try {
    const { username, password, description = '', roles = [] } = params;
    let cypherScripts = queryCyphers({
      username,
      password,
      description,
      roles: JSON.stringify(roles),
    });

    const cypherPromise = cypherScripts.map(async cypher => {
      return await request({ driver, cypher });
    });
    const result = await Promise.all(cypherPromise);

    const error = result?.find(d => !d?.success);

    if (error) {
      return error;
    }

    return result[0];
  } catch (error) {
    return error;
  }
};

/* 创建角色 */
export const queryCreateRole = async (
  driver: Driver,
  params: IRoleParams,
): Promise<any> => {
  const { role, description = '', permissions = null } = params;
  const cypherQuery = createRole(role, description);
  if (!permissions) {
    const result = await request({ driver, cypher: cypherQuery });
    return result;
  }

  // 1.创建角色
  const createRoleresult = await request({ driver, cypher: cypherQuery });

  if (!createRoleresult.success) {
    return createRoleresult;
  }

  // 2. 修改角色对图的访问权限
  return await request({
    driver,
    cypher: modRoleAccessLevel(role, convertPermissions(permissions)),
  });
};

/* 编辑角色 */
export const updateRole = async (
  driver: Driver,
  params: IRoleParams,
): Promise<any> => {
  const { role, description = '', permissions = null } = params;
  const cypherQuery = modRoleDesc(role, description);
  if (!permissions) {
    const result = await request({ driver, cypher: cypherQuery });
    return result;
  }

  let cypherScripts = [
    // 1.修改角色描述信息
    cypherQuery,
    // 2. 修改角色对图的访问权限
    modRoleAccessLevel(role, convertPermissions(permissions)),
  ];

  const cypherPromise = cypherScripts.map(async cypher => {
    return await request({ driver, cypher });
  });
  const result = await Promise.all(cypherPromise);

  const error = result?.find(d => !d?.success);

  if (error) {
    return error;
  }

  return result[0];
};

/* 获取对应类型 */
const getType = (schema: Schema[], name: string | undefined) => {
  const { properties, primary } = schema?.find(
    itemSchema => itemSchema?.label === name,
  ) || {};
  const type = properties?.find(itemType => itemType.name === primary);
  return type || {};
};

/* 给files数据添加properties 属性类型 */
const onAddProperties = (schema: Schema[], files: FileSchema[]) => {
  const newFiles = [...files].map(itemFiles => {
    //边需要获取节点类型
    if ('SRC_ID' in itemFiles) {
      const { SRC_ID, DST_ID } = itemFiles || {};
      const newProperties = [
        ...(schema?.find(itemSchema => itemSchema?.label === itemFiles?.label)
          ?.properties || []),
      ];

      // 起点和终点都是一个，类型获取一次
      if (SRC_ID === DST_ID) {
        const type:SchemaProperty  = getType(schema, SRC_ID);
        newProperties.push(
          { ...type, name: 'SRC_ID' },
          { ...type, name: 'DST_ID' },
        );
      } else {
        newProperties.push(
          { ...getType(schema, SRC_ID), name: 'SRC_ID' },
          { ...getType(schema, DST_ID), name: 'DST_ID' },
        );
      }
      return {
        ...itemFiles,
        properties: newProperties,
      };
    } else {
      const properties = schema?.find(
        itemSchema => itemSchema?.label === itemFiles?.label,
      )?.properties || {};
      return {
        ...itemFiles,
        properties,
      };
    }
  });

  return newFiles;
};

/**
 * 从模版创建子图
 * @param graphName
 * @returns
 */
export const createSubGraphFromTemplate = async (
  driver: Driver,
  params: {
    graphName: string;
    config: { maxSizeGB: number; description: string };
    path: string;
  },
) => {
  const { graphName, config, path } = params;

  const { schema, files } = await fetch(
    `${window.location.origin}${path}`,
  ).then(res => res.json());
  // 1. 创建子图
  const createSubGraphResult = await request({
    driver,
    cypher: createGraph({ graphName, config }),
  });
  if (!createSubGraphResult?.success) {
    return createSubGraphResult;
  }

  const createAfterResult = await importSchema(driver, schema, graphName);
  if (!createAfterResult?.success) {
    return createAfterResult;
  }
  const newFiles = onAddProperties(schema, files)
  const importDataResult = await importData({ driver, graphName, files:newFiles });

  return importDataResult;
};
