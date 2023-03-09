import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphSchemaController extends Controller {

  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;
    const { graphName } = ctx.query;
    const authorization = ctx.request.header.authorization as string;

    const result = await ctx.service.tugraph.querySchema(graphName, authorization);
    responseData(ctx, result);
  }

  async getSubGraphList() {
    const { ctx } = this;

    const result = await ctx.service.tugraph.getSubGraphList();
    responseData(ctx, result);
  }

  async getVertexEdgeCount() {
    const { ctx } = this;
    const { graphName } = ctx.query;

    const result = await ctx.service.tugraph.getVertexEdgeCount(graphName);
    responseData(ctx, result);
  }
}

export default TuGraphSchemaController;
