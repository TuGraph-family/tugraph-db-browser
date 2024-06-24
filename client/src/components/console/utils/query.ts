import { InitialState } from '@/app';
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
import { useModel } from 'umi';
import {
  IRoleParams,
  ISubGraphTemplateParams,
  IUserParams,
} from '../../../../../server/app/service/tugraph/interface';
import { createGraph } from '@/queries/graph';
import { createDemoGraph } from '@/components/studio/services/GraphController';
import { FileSchema, Schema } from '@/components/studio/interface/import';

const getSession = () => {
  const { initialState } = useModel('@@initialState');
  const { session: _session } = initialState as InitialState;
  return _session;
};

/* 获取用户列表 */
export const queryUsers = async (params: { username?: string }) => {
  const session = getSession();
  const { username } = params;
  // 1、列出所有用户
  try {
    const cypherQuery = username ? getUserInfo(username) : listUsers();
    const userResult = await session.run(cypherQuery);
    if (!userResult.success) {
      return userResult;
    }
    // 2、列出所有角色
    const roleResult = await session.run(listRoles());

    if (!roleResult.success) {
      return roleResult;
    }

    const result = userInfoTranslator(userResult?.data, roleResult?.data);

    return {
      success: true,
      code: 200,
      data: result,
    };
  } catch (error) {
    console.log(error);
  }
};

/* 创建用户 */
export const queryCreateUser = async (params: IUserParams): Promise<any> => {
  try {
    const session = getSession();
    const { username, password, description = '', roles = [] } = params;

    // 1.创建用户
    const createResult = await session.run(createUser(username, password));

    if (!createResult?.success) {
      return createResult;
    }

    const cypherScripts = queryCreateCyphers(
      username,
      description,
      JSON.stringify(roles),
    );

    const cypherPromise = cypherScripts.map(async cypher => {
      return await session.run(cypher);
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
export const updateUser = async (params: IUserParams): Promise<any> => {
  try {
    const session = getSession();
    const { username, password, description = '', roles = [] } = params;
    let cypherScripts = queryCyphers({
      username,
      password,
      description,
      roles: JSON.stringify(roles),
    });

    const cypherPromise = cypherScripts.map(async cypher => {
      return await session.run(cypher);
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
export const queryCreateRole = async (params: IRoleParams): Promise<any> => {
  const session = getSession();
  const { role, description = '', permissions = null } = params;
  const cypherQuery = createRole(role, description);
  if (!permissions) {
    const result = await session.run(cypherQuery);
    return result;
  }

  // 1.创建角色
  const createRoleresult = await session.run(cypherQuery);

  if (!createRoleresult.success) {
    return createRoleresult;
  }

  // 2. 修改角色对图的访问权限
  return await session.run(
    modRoleAccessLevel(role, convertPermissions(permissions)),
  );
};

/* 编辑角色 */
export const updateRole = async (params: IRoleParams): Promise<any> => {
  const session = getSession();
  const { role, description = '', permissions = null } = params;
  const cypherQuery = modRoleDesc(role, description);
  if (!permissions) {
    const result = await session.run(cypherQuery);
    return result;
  }

  let cypherScripts = [
    // 1.修改角色描述信息
    cypherQuery,
    // 2. 修改角色对图的访问权限
    modRoleAccessLevel(role, convertPermissions(permissions)),
  ];

  const cypherPromise = cypherScripts.map(async cypher => {
    return await session.run(cypher);
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
export const createSubGraphFromTemplate = async (params: {
  graphName: string;
  config: { maxSizeGB: number; description: string };
  description: { schema: Schema[]; files: FileSchema[] };
}) => {
  const session = getSession();
  const { graphName, config, description } = params;
  const { schema, files } = description;
  // 1. 创建子图
  const createSubGraphResult = await session.run(
    createGraph({ graphName, config }),
  );
  if (!createSubGraphResult?.success) {
    return createSubGraphResult;
  }

  const createAfterResult = await createDemoGraph(params);
  return createAfterResult;
};
