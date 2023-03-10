import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphSchemaController extends Controller {

  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;
    const { graphName } = ctx.query;

    const result = await ctx.service.tugraph.schema.querySchema(graphName);
    responseData(ctx, result);
  }

  async getVertexEdgeCount() {
    const { ctx } = this;
    const { graphName } = ctx.query;

    const result = await ctx.service.tugraph.schema.getVertexEdgeCount(graphName);
    responseData(ctx, result);
  }
}

export default TuGraphSchemaController;
