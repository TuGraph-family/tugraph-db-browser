import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphQueryController extends Controller {
  async queryVertexById() {
    const { ctx } = this;
    const { graphName, vertexId } = ctx.query;
    const result = await ctx.service.tugraph.query.queryNodeById(graphName, vertexId);
    responseData(ctx, result);
  }

  async queryByGraphLanguage() {
    const { ctx } = this;
    const params = ctx.request.body;

    const result = await ctx.service.tugraph.query.queryByGraphLanguage(params);
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
