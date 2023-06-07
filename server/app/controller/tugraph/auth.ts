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
}

export default AuthController;
