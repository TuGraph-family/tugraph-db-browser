/**
 * 权限相关，主要包括以下几部分内容：
 * 1. 登陆
 * 2. 登出
 * 3. 创建新用户
 * 4. 编辑用户信息
 */

import { Service } from 'egg';
import { EngineServerURL } from './constant';

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
}

export default TuGraphAuthService;
