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

  async getVertexEdgeSchemaCount() {
    const { ctx } = this
    const { graphName } = ctx.query
    const result = await ctx.service.tugraph.schema.statisticsSchemaCount(graphName)
    responseData(ctx, result);
  }

  async createSchema() {
    const { ctx } = this
    const params = ctx.request.body
    const result = await ctx.service.tugraph.schema.createSchema(params)
    responseData(ctx, result);
  }

  async updateSchema() {
    const { ctx } = this
    const params = ctx.request.body
    const result = await ctx.service.tugraph.schema.updateSchema(params)
    responseData(ctx, result);
  }

  async getSchemaByType() {
    const { ctx } = this
    const { graphName, labelType, labelName } = ctx.query
    const result = await ctx.service.tugraph.schema.querySchemaByLabel(graphName, labelType as 'node' | 'edge', labelName)
    responseData(ctx, result);
  }
}

export default TuGraphSchemaController;
