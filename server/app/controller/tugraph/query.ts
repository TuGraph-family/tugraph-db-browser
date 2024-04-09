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

  async queryByConfig() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryByConfig(params);
    responseData(ctx, result);
  }
  async queryListProcedures() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryListProcedures(params);
    responseData(ctx, result);
  }
  async queryUploadProcedure() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryUploadProcedure(params);
    responseData(ctx, result);
  }
  async queryGetProcedures() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryGetProcedures(params);
    responseData(ctx, result);
  }
  async queryCallProcedures() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryCallProcedures(params);
    responseData(ctx, result);
  }
  async queryDeleteProcedure() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryDeleteProcedure(params);
    responseData(ctx, result);
  }
  async queryGetProcedureDemo() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.query.queryGetProcedureDemo(
      params,
    );
    responseData(ctx, result);
  }
}

export default TuGraphQueryController;
