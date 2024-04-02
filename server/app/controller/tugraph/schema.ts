import { Controller } from 'egg';
import { responseData } from '../../util';

class TuGraphSchemaController extends Controller {
  /**
   * 获取 Schema
   */
  async getSchema() {
    const { ctx } = this;
    const { graphName } = ctx.params;

    const result = await ctx.service.tugraph.schema.querySchema(graphName);
    responseData(ctx, result);
  }

  async getVertexEdgeCount() {
    const { ctx } = this;
    const { graphName } = ctx.query;

    const result =
      await ctx.service.tugraph.schema.getVertexEdgeCount(graphName);
    responseData(ctx, result);
  }

  async getVertexEdgeSchemaCount() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const result =
      await ctx.service.tugraph.schema.statisticsSchemaCount(graphName);
    responseData(ctx, result);
  }
  async getCountDetail() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const result = await ctx.service.tugraph.schema.getCountDetail(graphName);
    responseData(ctx, result);
  }
  async getCount() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const result = await ctx.service.tugraph.schema.getCount(graphName);
    responseData(ctx, result);
  }
  /**
   * 点边统计
   */
  async vertexEdgeStatistics() {
    const { ctx } = this;
    const { graphName } = ctx.params;

    // step1: 查询点边类型的数量，即 schema 中点边类型
    const schemaResult =
      await ctx.service.tugraph.schema.statisticsSchemaCount(graphName);

    // step2: 查询数据库中点边的数量
    const result = await ctx.service.tugraph.schema.getCount(graphName);

    const { data: labelData, success, code } = schemaResult;
    const { vertexLabels, edgeLabels } = labelData;
    const { data } = result;
    const vertexCount =
      data?.result?.find((item: any) => item['type'] === 'vertex')['number'] ||
      0;
    const edgeCount =
      data?.result?.find((item: any) => item['type'] === 'edge')['number'] || 0;
    const respData = {
      success,
      code,
      data: {
        vertexLabels,
        edgeLabels,
        vertexCount,
        edgeCount,
      },
    };
    responseData(ctx, respData);
  }

  async createSchema() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const params = {
      graphName,
      ...ctx.request.body,
    };

    const result = await ctx.service.tugraph.schema.createSchema(params);
    responseData(ctx, result);
  }

  async deleteSchema() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const params = {
      graphName,
      ...ctx.request.body,
    };
    const result = await ctx.service.tugraph.schema.deleteSchema(params);
    responseData(ctx, result);
  }

  async createProperty() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const params = {
      graphName,
      ...ctx.request.body,
    };
    const result = await ctx.service.tugraph.schema.addFieldToLabel(params);
    responseData(ctx, result);
  }

  async updateProperty() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const params = {
      graphName,
      ...ctx.request.body,
    };
    const result = await ctx.service.tugraph.schema.updateFieldToLabel(params);
    responseData(ctx, result);
  }

  async deleteProperty() {
    const { ctx } = this;
    const { graphName } = ctx.params;
    const { labelName, labelType, propertyNames } = ctx.request.body;
    const params = {
      graphName,
      labelName,
      labelType: labelType as 'node' | 'edge',
      propertyNames,
    };
    const result = await ctx.service.tugraph.schema.deleteLabelField(params);
    responseData(ctx, result);
  }

  async getSchemaByType() {
    const { ctx } = this;
    const { graphName, labelType, labelName } = ctx.query;
    const result = await ctx.service.tugraph.schema.querySchemaByLabel(
      graphName,
      labelType as 'node' | 'edge',
      labelName,
    );
    responseData(ctx, result);
  }

  /**
   * 创建索引
   */
  async createIndex() {
    const { ctx } = this;
    const params = ctx.request.body;
    const { graphName } = ctx.params;
    const result = await ctx.service.tugraph.schema.createIndex(
      graphName,
      params,
      true,
    );
    responseData(ctx, result);
  }

  /**
   * 删除索引
   */
  async deleteIndex() {
    const { ctx } = this;
    const { labelName, propertyName } = ctx.request.body;
    const { graphName } = ctx.params;
    const result = await ctx.service.tugraph.schema.deleteIndex(graphName, {
      labelName,
      propertyName,
    });
    responseData(ctx, result);
  }

  /**
   * schema 导入
   */
  async importSchema() {
    const { ctx } = this;
    const params = ctx.request.body;
    const result = await ctx.service.tugraph.schema.importSchema(params);
    responseData(ctx, result);
  }
}

export default TuGraphSchemaController;
