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
  async importSchema() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.info.importSchema(
      ctx.request.body,
    );
    responseData(ctx, result);
  }
  async importProgress() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.info.importProgress(
      ctx.request.body,
    );
    responseData(ctx, result);
  }
  async importData() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.info.importData(ctx.request.body);
    responseData(ctx, result);
  }
  async checkFile() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.info.checkFile(ctx.request.body);
    responseData(ctx, result);
  }
  async uploadFile() {
    const { ctx } = this;
    const result = await ctx.service.tugraph.info.uploadFile(
      ctx.request.headers,
    );
    responseData(ctx, result);
  }
}

export default TuGraphInfoController;
