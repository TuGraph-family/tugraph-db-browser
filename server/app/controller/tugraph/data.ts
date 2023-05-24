import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphDataController extends Controller {
  async createNode() {
    const { ctx } = this;
    const { graphName, labelName, properties } = ctx.request.body;
    const result = await ctx.service.tugraph.data.createNode(
      graphName,
      labelName,
      properties
    );
    responseData(ctx, result);
  }

  async createEdge() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.data.createEdge(params);
    responseData(ctx, result);
  }

  async deleteNode() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.data.deleteNode(params);
    responseData(ctx, result);
  }

  async deleteEdge() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.data.deleteEdge(params);
    responseData(ctx, result);
  }

  async updateNode() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.data.updateNode(params);
    responseData(ctx, result);
  }

  async updateEdge() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.data.updateEdge(params);
    responseData(ctx, result);
  }
}

export default TuGraphDataController;
