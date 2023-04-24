import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphInfoController extends Controller {
  async querySystemInfo() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.info.querySystemInfo();
    responseData(ctx, result);
  }

  async queryDatabaseInfo() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.info.queryDatabaseInfo();
    responseData(ctx, result);
  }
}

export default TuGraphInfoController;
