import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphAlgorithmController extends Controller {
  /**
   * 创建算法配置
   */
  async createAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.algorithm.createAlgorithm(params);
    responseData(ctx, result);
  }
  /**
   * 获取算法配置列表
   */
  async getAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.algorithm.getAlgorithm(params);
    responseData(ctx, result);
  }
  /**
   * 获取算法配置结果
   */
  async getAlgorithmResult() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.algorithm.getAlgorithmResult(
      params,
    );
    responseData(ctx, result);
  }
  /**
   * 更新算法配置
   */
  async uploadAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.algorithm.uploadAlgorithm(params);
    responseData(ctx, result);
  }
  /**
   * 删除算法配置
   */
  async deleteAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.algorithm.deleteAlgorithm(params);
    responseData(ctx, result);
  }
  /**
   * 运行算法配置
   */
  async callAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.algorithm.callAlgorithm(params);
    responseData(ctx, result);
  }
  /**
   * 运行列表
   */
  async listProceduresAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.algorithm.listProceduresAlgorithm(
      params,
    );
    responseData(ctx, result);
  }
  /**
   * 获取运行
   */
  async getProceduresAlgorithm() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.algorithm.getProceduresAlgorithm(
      params,
    );
    responseData(ctx, result);
  }
}

export default TuGraphAlgorithmController;
