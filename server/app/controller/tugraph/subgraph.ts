import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphSubGraphController extends Controller {
  async createSubGraph() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { graphName, config } = params;
    const result = await ctx.service.tugraph.subgraph.createSubGraph(
      graphName,
      config
    );
    responseData(ctx, result);
  }

  async createSubGraphFromTemplate() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result =
      await ctx.service.tugraph.subgraph.createSubGraphFromTemplate(params);
    responseData(ctx, result);
  }

  async updateSubGraph() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { graphName, config } = params;

    const result = await ctx.service.tugraph.subgraph.updateSubGraph(
      graphName,
      config
    );
    responseData(ctx, result);
  }

  async deleteSubGraph() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { graphName } = params;

    const result = await ctx.service.tugraph.subgraph.deleteSubGraph(graphName);
    responseData(ctx, result);
  }

  async subGraphDetailInfo() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const result = await ctx.service.tugraph.subgraph.getSubGraphInfo(
      graphName
    );
    responseData(ctx, result);
  }

  /**
   * 获取子图列表
   */
  async getSubGraphList() {
    const { ctx } = this;
    const { userName } = ctx.query;
    const result = await ctx.service.tugraph.subgraph.getSubGraphList(userName);
    responseData(ctx, result);
  }
}

export default TuGraphSubGraphController;
