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
import {
  IRoleParams,
  ISubGraphTemplateParams,
  IUserParams,
} from '../../../../../server/app/service/tugraph/interface';
import { createGraph } from '@/queries/graph';
import { createDemoGraph } from '@/components/studio/services/GraphController';
import { FileSchema, Schema } from '@/components/studio/interface/import';
import { Driver } from 'neo4j-driver';
import { request } from '@/services/request';




/* 获取用户列表 */
export const queryUsers = async (driver:Driver,params: { username?: string }) => {
  
  const { username } = params;
  // 1、列出所有用户
    const cypherQuery = username ? getUserInfo(username) : listUsers();
    const userResult = await request(driver,cypherQuery);
    if (!userResult?.success) {
      return userResult;
    }
    // 2、列出所有角色
    const roleResult = await request(driver,listRoles());

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
export const queryCreateUser = async (driver:Driver,params: IUserParams): Promise<any> => {
  try {
  
    const { username, password, description = '', roles = [] } = params;

    // 1.创建用户
    const createResult = await request(driver,createUser(username, password));

    if (!createResult?.success) {
      return createResult;
    }

    const cypherScripts = queryCreateCyphers(
      username,
      description,
      JSON.stringify(roles),
    );

    const cypherPromise = cypherScripts.map(async cypher => {
      return await request(driver,cypher);
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
export const updateUser = async (driver:Driver,params: IUserParams): Promise<any> => {
  try {
  
    const { username, password, description = '', roles = [] } = params;
    let cypherScripts = queryCyphers({
      username,
      password,
      description,
      roles: JSON.stringify(roles),
    });

    const cypherPromise = cypherScripts.map(async cypher => {
      return await request(driver,cypher);
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
export const queryCreateRole = async (driver:Driver,params: IRoleParams): Promise<any> => {

  const { role, description = '', permissions = null } = params;
  const cypherQuery = createRole(role, description);
  if (!permissions) {
    const result = await request(driver,cypherQuery);
    return result;
  }

  // 1.创建角色
  const createRoleresult = await request(driver,cypherQuery);

  if (!createRoleresult.success) {
    return createRoleresult;
  }

  // 2. 修改角色对图的访问权限
  return await request(
    driver,
    modRoleAccessLevel(role, convertPermissions(permissions)),
  );
};

/* 编辑角色 */
export const updateRole = async (driver:Driver,params: IRoleParams): Promise<any> => {

  const { role, description = '', permissions = null } = params;
  const cypherQuery = modRoleDesc(role, description);
  if (!permissions) {
    const result = await request(driver,cypherQuery);
    return result;
  }

  let cypherScripts = [
    // 1.修改角色描述信息
    cypherQuery,
    // 2. 修改角色对图的访问权限
    modRoleAccessLevel(role, convertPermissions(permissions)),
  ];

  const cypherPromise = cypherScripts.map(async cypher => {
    return await request(driver,cypher);
  });
  const result = await Promise.all(cypherPromise);

  const error = result?.find(d => !d?.success);

  if (error) {
    return error;
  }

  return result[0];
};

/**
 * 从模版创建子图
 * @param graphName
 * @returns
 */
export const createSubGraphFromTemplate = async (driver:Driver,params: {
  graphName: string;
  config: { maxSizeGB: number; description: string };
  description: { schema: Schema[]; files: FileSchema[] };
}) => {
  const { graphName, config, description } = params;
  const { schema, files } = description;
  // 1. 创建子图
  const createSubGraphResult = await request(
    driver,
    createGraph({ graphName, config }),
  );
  if (!createSubGraphResult?.success) {
    return createSubGraphResult;
  }

  const createAfterResult = await createDemoGraph(params);
  return createAfterResult;
};
