// @ts-nocheck

/**
 * 权限相关，主要包括以下几部分内容：
 * 1. 登陆
 * 2. 登出
 * 3. 创建新用户
 * 4. 编辑用户信息
 */

import { Service } from 'egg';
import { responseFormatter } from '../../util';
import { convertPermissions, userInfoTranslator } from '../../utils/auth';
import { EngineServerURL } from './constant';
import { IRoleParams, IUserParams } from './interface';

class TuGraphAuthService extends Service {
  async executeCypherQuery(cypherQuery: string, graph = '') {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this?.ctx?.request?.header?.authorization,
      },
      method: 'POST',
      data: {
        graph,
        script: cypherQuery,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }

  async curlPost(path: string, params: any) {
    const result = await this.ctx.curl(`${path}/`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this?.ctx?.request?.header?.authorization,
      },
      method: 'POST',
      data: {
        ...params,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }
  /**
   * 创建新用户
   */
  async createUser(params: IUserParams): Promise<any> {
    const { username, password, description = '', roles = [] } = params;

    // 1.创建用户
    const createResult = await this.executeCypherQuery(
      `CALL dbms.security.createUser('${username}', '${password}')`,
    );

    if (!createResult.success) {
      return createResult;
    }

    const cypherScripts = [
      // 2. 设置用户描述
      `CALL dbms.security.setUserDesc('${username}', '${description}')`,
      // 3. 赋予用户角色
      `CALL dbms.security.addUserRoles('${username}', ${JSON.stringify(
        roles,
      )})`,
    ];

    const cypherPromise = cypherScripts.map(async cypher => {
      return await this.executeCypherQuery(cypher);
    });
    const result = await Promise.all(cypherPromise);

    const error = result?.find(d => !d?.success);

    if (error) {
      return error;
    }

    return result[0];
  }

  /**
   * 编辑用户
   */
  async updateUser(params: IUserParams): Promise<any> {
    const { username, password, description = '', roles = [] } = params;
    let cypherScripts = queryCyphers({
      username,
      password,
      description,
      roles: JSON.stringify(
        roles,
      )
    }) 

    const cypherPromise = cypherScripts.map(async cypher => {
      return await this.executeCypherQuery(cypher);
    });
    const result = await Promise.all(cypherPromise);

    const error = result?.find(d => !d?.success);

    if (error) {
      return error;
    }

    return result[0];
  }

  /**
   * 查询用户列表
   */
  async queryUsers(username?: string): Promise<any> {
    // 1、列出所有用户
    const cypherQuery = username
      ? `CALL dbms.security.getUserInfo('${username}')`
      : `CALL dbms.security.listUsers()`;
    const userResult = await this.executeCypherQuery(cypherQuery);

    if (!userResult.success) {
      return userResult;
    }
    // 2、列出所有角色
    const roleResult = await this.queryRoles();

    if (!roleResult.success) {
      return roleResult;
    }

    const result = userInfoTranslator(userResult?.data, roleResult?.data);

    return {
      success: true,
      code: 200,
      data: result,
    };
  }

  /**
   * 删除用户
   */
  async deleteUser(username: string): Promise<any> {
    const cypherQuery = `CALL dbms.security.deleteUser('${username}')`;
    const result = await this.executeCypherQuery(cypherQuery);
    return result;
  }

  /**
   * 修改密码
   */

  async updatePassword(param: IUserParams): Promise<any> {
    const { curPassword, password } = param;
    const cypherQuery = `CALL dbms.security.changePassword('${curPassword}', '${password}')`;
    const result = await this.executeCypherQuery(cypherQuery);
    return result;
  }

  /**
   * 禁用启用用户
   */
  async setUserDisabledStatus(
    username: string,
    disabled: boolean,
  ): Promise<any> {
    const cypherQuery = `CALL dbms.security.disableUser('${username}', ${disabled})`;
    const result = await this.executeCypherQuery(cypherQuery);
    return result;
  }

  /**
   * 创建角色
   */
  async createRole(params: IRoleParams): Promise<any> {
    const { role, description = '', permissions = null } = params;

    if (!permissions) {
      const cypherQuery = `CALL dbms.security.createRole('${role}','${description}')`;
      const result = await this.executeCypherQuery(cypherQuery);
      return result;
    }

    // 1.创建角色

    const createRoleresult = await this.executeCypherQuery(
      `CALL dbms.security.createRole('${role}','${description}')`,
    );

    if (!createRoleresult.success) {
      return createRoleresult;
    }

    // 2. 修改角色对图的访问权限
    return await this.executeCypherQuery(
      `CALL dbms.security.modRoleAccessLevel('${role}', ${convertPermissions(
        permissions,
      )})`,
    );
  }

  /**
   * 编辑角色
   */
  async updateRole(params: IRoleParams): Promise<any> {
    const { role, description = '', permissions = null } = params;

    if (!permissions) {
      const cypherQuery = `CALL dbms.security.modRoleDesc('${role}','${description}')`;
      const result = await this.executeCypherQuery(cypherQuery);
      return result;
    }

    let cypherScripts = [
      // 1.修改角色描述信息
      `CALL dbms.security.modRoleDesc('${role}','${description}')`,
      // 2. 修改角色对图的访问权限
      `CALL dbms.security.modRoleAccessLevel('${role}', ${convertPermissions(
        permissions,
      )})`,
    ];

    const cypherPromise = cypherScripts.map(async cypher => {
      return await this.executeCypherQuery(cypher);
    });
    const result = await Promise.all(cypherPromise);

    const error = result?.find(d => !d?.success);

    if (error) {
      return error;
    }

    return result[0];
  }

  /**
   * 查询角色列表
   */
  async queryRoles(): Promise<any> {
    const cypherQuery = `CALL dbms.security.listRoles()`;
    const result = await this.executeCypherQuery(cypherQuery);
    return result;
  }

  /**
   * 删除角色
   */
  async deleteRole(role: string): Promise<any> {
    const cypherQuery = `CALL dbms.security.deleteRole('${role}')`;
    const result = await this.executeCypherQuery(cypherQuery);
    return result;
  }

  /**
   * 禁用启用角色
   */
  async setRoleDisabledStatus(role: string, disabled: boolean): Promise<any> {
    const cypherQuery = `CALL dbms.security.disableRole('${role}', ${disabled})`;
    const result = await this.executeCypherQuery(cypherQuery);
    return result;
  }
  /**
   * 登录
   */
  async login(params: any): Promise<any> {
    const result = await this.curlPost(`${EngineServerURL}/login`, params);
    return result;
  }
  /**
   * 退出登录
   */
  async logout(): Promise<any> {
    const result = await this.curlPost(`${EngineServerURL}/logout`, {});
    return result;
  }
  /**
   * 刷新token
   */
  async refreshAuthToken(params: any): Promise<any> {
    const result = await this.curlPost(`${EngineServerURL}/refresh`, params);
    return result;
  }
}

export default TuGraphAuthService;
