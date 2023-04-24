import { Controller } from 'egg';
import { responseData } from '../../util';

class AuthController extends Controller {
  /**
   * 获取登陆token
   */
  async login() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    const result = await ctx.service.tugraph.auth.login(username, password);
    responseData(ctx, result);
  }

  /**
   * 创建用户
   */
  async createUser() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.auth.createUser(params);
    responseData(ctx, result);
  }

  /**
   * 删除用户
   */
  async deleteUser() {
    const { ctx } = this;
    const { username } = ctx.request.query;
    const result = await ctx.service.tugraph.auth.deleteUser(username);
    responseData(ctx, result);
  }

  /**
   * 禁用启用用户
   */
  async setUserDisabledStatus() {
    const { ctx } = this;
    const { username, disabled } = ctx.request.body;
    const result = await ctx.service.tugraph.auth.setUserDisabledStatus(
      username,
      disabled
    );
    responseData(ctx, result);
  }
}

export default AuthController;
