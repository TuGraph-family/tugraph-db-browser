import { Controller } from 'egg';
import { responseData } from '../../util';

class AuthController extends Controller {
  /**
   * 查询用户列表
   */
  async getUserList() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.auth.queryUsers(
      ctx.request.query?.username,
    );
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
   * 修改用户
   */
  async updateUser() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.auth.updateUser(params);
    responseData(ctx, result);
  }

  /**
   * 修改密码
   */
  async updatePassword() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.auth.updatePassword(params);
    responseData(ctx, result);
  }

  /**
   * 删除用户
   */
  async deleteUser() {
    const { ctx } = this;
    const { username } = ctx.request.body;
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
      disabled,
    );
    responseData(ctx, result);
  }

  /**
   * 查询用户列表
   */
  async getRoleList() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.auth.queryRoles();
    responseData(ctx, result);
  }

  /**
   * 创建角色
   */
  async createRole() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.auth.createRole(params);
    responseData(ctx, result);
  }

  /**
   * 修改角色
   */
  async updateRole() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.auth.updateRole(params);
    responseData(ctx, result);
  }

  /**
   * 删除角色
   */
  async deleteRole() {
    const { ctx } = this;
    const { role } = ctx.request.body;
    const result = await ctx.service.tugraph.auth.deleteRole(role);
    responseData(ctx, result);
  }

  /**
   * 禁用启用角色
   */
  async setRoleDisabledStatus() {
    const { ctx } = this;
    const { role, disabled } = ctx.request.body;
    const result = await ctx.service.tugraph.auth.setRoleDisabledStatus(
      role,
      disabled,
    );
    responseData(ctx, result);
  }
  // /**
  //  * 登录
  //  */
  async login() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.auth.login(ctx.request.body);
    responseData(ctx, result);
  }
  /**
   * 退出登录
   */
  async logout() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.auth.logout();
    responseData(ctx, result);
  }
  /**
   * 刷新token
   */
  async refreshAuthToken() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.auth.refreshAuthToken(
      ctx.request.body,
    );
    responseData(ctx, result);
  }
}

export default AuthController;
