import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphQueryController extends Controller {
  async queryByNode() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryByNode(params);
    responseData(ctx, result);
  }

  async queryByGraphLanguage() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryByGraphLanguage(params);
    responseData(ctx, result);
  }

  async queryByPath() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryByPath(params);
    responseData(ctx, result);
  }

  /**
   * 邻居查询
   */
  async queryNeighbors() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.tugraph.query.queryNeighbors(params);
    responseData(ctx, result);
  }
}

export default TuGraphQueryController;
