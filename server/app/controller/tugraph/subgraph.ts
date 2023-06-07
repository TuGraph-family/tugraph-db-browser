import { Controller } from 'egg';
import { responseData } from '../../util';

class SubGraphController extends Controller {
  /**
   * 获取子图列表
   */
  async getSubGraphList() {
    const { ctx } = this;

    const result = await ctx.service.tugraph.subgraph.getSubGraphList();
    responseData(ctx, result);
  }
}

export default SubGraphController;
