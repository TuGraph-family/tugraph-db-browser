/**
 * 权限相关，主要包括以下几部分内容：
 * 1. 登陆
 * 2. 登出
 * 3. 创建新用户
 * 4. 编辑用户信息
 */

import { Service } from 'egg';
import { responseFormatter } from '../../util';
import { EngineServerURL } from './constant';
import { IUserParams } from './interface';

class TuGraphAuthService extends Service {
  async login(username: string, password: string) {
    const result = await this.ctx.curl(`${EngineServerURL}/login`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        username,
        password,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: 200,
        data: null,
        errorMessage: result.data.errorMsg,
        errorCode: result.data.errorCode,
      };
    }
    const authorization = result.data.data.authorization;
    this.ctx.session.authorization = authorization;

    return {
      success: true,
      code: 200,
      data: {
        authorization,
      },
    };
  }

  async executeCypherQuery(cypherQuery: string) {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: '',
        script: cypherQuery,
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

    const cypherScripts = [
      // 1.创建用户
      `CALL dbms.security.createUser('${username}', '${password}')`,
      // 2. 设置用户描述
      `CALL dbms.security.setUserDesc('${username}', '${description}')`,
      // 3. 赋予用户角色
      `CALL dbms.security.addUserRoles('${username}', ${JSON.stringify(
        roles
      )})`,
    ];

    const cypherPromise = cypherScripts.map(async (cypher) => {
      const currentEdgeSchema = await this.executeCypherQuery(cypher);
      return currentEdgeSchema;
    });
    const result = await Promise.all(cypherPromise);
    return result[0];
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
   * 禁用启用用户
   */

  async setUserDisabledStatus(
    username: string,
    disabled: boolean
  ): Promise<any> {
    const cypherQuery = `CALL dbms.security.disableUser('${username}', ${disabled})`;
    const result = await this.executeCypherQuery(cypherQuery);
    return result;
  }
}

export default TuGraphAuthService;
