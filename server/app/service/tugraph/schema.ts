// @ts-nocheck

/**
 * Schema 相关，主要包括以下几部分内容：
 * 1. 创建 Schema
 * 2. 查询 Schema
 * 3. 点类型
 * 4. 边类型
 * 5. 修改 Schema
 */

import { Service } from 'egg';
import { responseFormatter } from '../../util';
import {
  formatEdgeSchemaResponse,
  formatVertexSchemaResponse,
} from '../../utils/schema';
import { DATA_TYPE, EngineServerURL } from './constant';
import {
  ICreateSchemaParams,
  IDeleteSchemaParams,
  IIndexParams,
  ISchemaParams,
  IUpdateSchemaParams,
} from './interface';

class TuGraphSchemaService extends Service {
  /**
   * 创建 Schema
   * @param params
   * @returns
   */
  async createSchema(params: ICreateSchemaParams) {
    const {
      graphName,
      labelType,
      labelName,
      properties,
      primaryField,
      edgeConstraints = [],
      indexs = [],
    } = params;

    let condition = '';
    properties.forEach((d, key) => {
      const { name, type, optional = false } = d;
      if (key === properties.length - 1) {
        condition += `['${name}', ${type}, ${optional}]`;
      } else {
        condition += `['${name}', ${type}, ${optional}],`;
      }
    });

    let cypher = ``;
    if (labelType === 'node') {
      cypher = `CALL db.createLabel('vertex', '${labelName}', '${primaryField}', ${condition})`;
    } else if (labelType === 'edge') {
      cypher = condition
        ? `CALL db.createLabel('edge', '${labelName}', '${JSON.stringify(
            edgeConstraints,
          )}', ${condition})`
        : `CALL db.createLabel('edge', '${labelName}', '${JSON.stringify(
            edgeConstraints,
          )}')`;
    }

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    if (result.data.errorCode != 200) {
      return {
        code: 200,
        errorCode: result.data.errorCode,
        errorMessage: result.data.errorMessage,
        success: false,
      };
    }

    // 创建 Schema 后，如果有配置索引，还需要再创建索引
    if (indexs.length > 0) {
      // 配置了索引，则需要创建索引
      const indexPromise = indexs.map(async d => {
        // 主键即为索引，无需再创建
        if (d.propertyName !== primaryField) {
          const currentEdgeSchema = await this.createIndex(graphName, d, true);
          return currentEdgeSchema;
        }
      });

      const indexsResult = await Promise.all(indexPromise);

      // 无返回说明不需要额外创建索引
      if (!indexsResult) {
        return responseFormatter(result);
      }

      const indexError = indexsResult?.find(d => !d?.success);

      if (indexError) {
        // 说明有索引创建失败，则提示用户
        return {
          success: false,
          code: 200,
          errorCode: indexError.errorCode,
          errorMessage: `Schema 创建成功，但有部分索引创建失败，具体失败原因为：${indexError.errorMessage}`,
        };
      }
    }
    return responseFormatter(result);
  }

  /**
   * 向指定的 label 中添加属性
   * @param params
   * @returns
   */
  async addFieldToLabel(params: IUpdateSchemaParams) {
    const { graphName, labelType, labelName, properties } = params;
    // const trimDot = /([\'])([0-9]+[\.\-\:\ ][0-9]+)+([\'])/g;
    let condition = '';
    properties.forEach((d, index) => {
      const { name, type, optional = false } = d;
      const currentType = DATA_TYPE.find(item => item['value'] === type);
      const isINT = `${type}`.includes('INT');

      const isBOOL = `${type}`.includes('BOOL');
      const isDOUBLE = `${type}`.includes('DOUBLE');
      const defaultValue =
        isINT || isBOOL || isDOUBLE
          ? currentType?.default
          : `'${currentType?.default}'`;
      if (index === properties.length - 1) {
        condition += `['${name}', ${type}, ${defaultValue}, ${optional}]`;
      } else {
        condition += `['${name}', ${type}, ${defaultValue}, ${optional}],`;
      }
    });

    const type = labelType === 'node' ? 'vertex' : 'edge';

    const cypher = `CALL db.alterLabelAddFields('${type}', '${labelName}', ${condition})`;

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }

  /**
   * 修改 Label 中指定的属性字段
   * @param params
   * @returns
   */
  async updateFieldToLabel(params: IUpdateSchemaParams) {
    const { graphName, labelType, labelName, properties } = params;

    let condition = '';
    properties.forEach((d, index) => {
      const { name, type, optional = false } = d;
      if (index === properties.length - 1) {
        condition += `['${name}', ${type}, ${optional} ]`;
      } else {
        condition += `['${name}', ${type}, ${optional} ],`;
      }
    });

    const type = labelType === 'node' ? 'vertex' : 'edge';

    let cypher = `CALL db.alterLabelModFields('${type}', '${labelName}', ${condition})`;
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }

  /**
   * 删除 指定 Label 中的属性字段
   * @param params
   * @returns
   */
  async deleteLabelField(params: IDeleteSchemaParams) {
    const { graphName, labelType, labelName, propertyNames } = params;
    const type = labelType === 'node' ? 'vertex' : 'edge';
    const cypher = `CALL db.alterLabelDelFields('${type}', '${labelName}', ${JSON.stringify(
      propertyNames,
    )})`;

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }

  /**
   * 根据类型和名称获取指定的 Schema 定义
   * @param graphName 子图名称
   * @param labelType 类型
   * @param labelName 名称
   * @returns
   */
  async querySchemaByLabel(
    graphName: string,
    labelType: 'node' | 'edge',
    labelName: string,
  ) {
    let cypher = '';
    if (labelType === 'node') {
      cypher = `CALL db.getVertexSchema('${labelName}')`;
    } else if (labelType === 'edge') {
      cypher = `CALL db.getEdgeSchema('${labelName}')`;
    }

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    if (labelType === 'node') {
      const vertexResponseData = formatVertexSchemaResponse(
        result.data.data.result[0].schema,
      );

      return {
        success: true,
        code: result.status,
        data: {
          ...vertexResponseData,
        },
      };
    } else if (labelType === 'edge') {
      const edgeResponseData = formatEdgeSchemaResponse(
        result.data.data.result[0].schema,
      );

      return {
        success: true,
        code: result.status,
        data: {
          ...edgeResponseData,
        },
      };
    }
  }

  /**
   * 获取所有边类型 Schema 的信息
   * @param graphName 子图名称
   * @return
   */
  async queryEdgeSchema(graphName: string) {
    // step1: 先获取所有边类型
    const typeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: 'CALL db.edgeLabels()',
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (!typeResult?.data?.data?.result) {
      return [];
    }

    // step2: 根据获取到的边类型，再获取每个边类型的详细属性
    const edgeSchemaPromise = typeResult.data.data.result.map(async d => {
      const currentEdgeSchema = await this.querySchemaByLabel(
        graphName,
        'edge',
        d.label,
      );
      return currentEdgeSchema;
    });
    const edgeSchema = await Promise.all(edgeSchemaPromise);

    return edgeSchema.map(d => {
      return d.data;
    });
  }

  async queryVertexSchema(graphName: string) {
    // step1: 先获取所有边点类型
    const typeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: 'CALL db.vertexLabels()',
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    if (!typeResult?.data?.data?.result) {
      return [];
    }

    // step2: 根据获取到的点类型，再获取每个点类型的详细属性
    const vertexSchemaPromise = typeResult.data.data.result.map(async d => {
      const currentVertexSchema = await this.querySchemaByLabel(
        graphName,
        'node',
        d.label,
      );
      return currentVertexSchema;
    });
    const vertexSchema = await Promise.all(vertexSchemaPromise);

    return vertexSchema.map(d => {
      return d.data;
    });
  }

  /**
   * 查询指定子图的 Schema
   * @param graphName 子图名称
   */
  async querySchema(graphName: string) {
    const vertexSchema = await this.queryVertexSchema(graphName);
    const edgeSchema = await this.queryEdgeSchema(graphName);

    return {
      code: 200,
      success: true,
      data: {
        nodes: vertexSchema,
        edges: edgeSchema,
      },
    };
  }
  /**
   * 查询指定子图中边的数量
   * @param graphName 子图名称
   * @param authorization 认证信息
   */
  async getCountDetail(graphName: string) {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: 'CALL dbms.meta.countDetail()',
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result?.data?.errorCode != 200) {
      return {
        success: false,
        code: result?.data?.errorCode,
        message: result?.data?.errorMessage,
      };
    }
    return {
      success: true,
      code: 200,
      ...result?.data,
    };
  }
  async getCount(graphName: string) {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: 'CALL dbms.meta.count()',
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result?.data?.errorCode != 200) {
      return {
        success: false,
        code: result?.data?.errorCode,
        message: result?.data?.errorMessage,
      };
    }
    return {
      success: true,
      code: 200,
      ...result?.data,
    };
  }
  /**
   * 查询指定子图中节点和边的数量
   * @param graphName 子图名称
   * @param authorization 认证信息
   */
  async getVertexEdgeCount(graphName: string) {
    const nodeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: 'MATCH (n) RETURN COUNT(n) as vertexCount',
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    if (nodeResult.status !== 200 || nodeResult.data.errorCode != 200) {
      return {
        success: false,
        code: nodeResult.status,
        data: {
          vertexCount: 0,
          edgeCount: 0,
        },
      };
    }

    // 查询 graph 中边的数量
    const edgeCypher = 'MATCH (n)-[e]->(m) RETURN count(e) as edgeCount';
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: edgeCypher,
      },
      timeout: [30000, 500000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: {
          vertexCount: nodeResult.data.data?.result?.[0]?.vertexCount,
          edgeCount: 0,
        },
      };
    }

    return {
      success: true,
      code: 200,
      data: {
        vertexCount: nodeResult.data.data?.result?.[0]?.vertexCount,
        edgeCount: result.data.data?.result?.[0].edgeCount,
      },
    };
  }

  /**
   * 统计点类型和边类型的数量
   * @returns
   */
  async statisticsSchemaCount(graphName: string) {
    const vertexCypher = `CALL db.vertexLabels() YIELD label RETURN count(label) AS vertexNumLabels`;
    const edgeCypher = `CALL db.edgeLabels() YIELD edgeLabels RETURN count(edgeLabels) AS edgeNumLabels`;

    const vertexResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: vertexCypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (vertexResult.status !== 200 || vertexResult.data.errorCode != 200) {
      return {
        success: false,
        errorMessage: vertexResult.data,
        errorCode: vertexResult.data.errorCode,
        data: {
          vertexLabels: 0,
          edgeLabels: 0,
        },
      };
    }

    const edgeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: edgeCypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (vertexResult.status !== 200 || vertexResult.data.errorCode != 200) {
      return {
        success: false,
        errorMessage: edgeResult.data,
        errorCode: vertexResult.data.errorCode,
        data: {
          vertexLabels: vertexResult.data.data?.result?.[0].vertexNumLabels,
          edgeLabels: 0,
        },
      };
    }

    return {
      success: true,
      code: 200,
      errorCode: vertexResult.data.errorCode,
      data: {
        vertexLabels: vertexResult.data.data?.result?.[0]?.vertexNumLabels,
        edgeLabels: edgeResult.data.data?.result?.[0]?.edgeNumLabels,
      },
    };
  }

  /**
   * 创建索引
   * @param graphName 图名称
   * @param params
   * @param isIndependentRequest 是否为独立请求
   * @returns
   */
  async createIndex(
    graphName: string,
    params: IIndexParams,
    isIndependentRequest = false,
  ) {
    const { labelName, propertyName, isUnique = true } = params;
    const cypher = `CALL db.addIndex('${labelName}', '${propertyName}', ${isUnique})`;
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (isIndependentRequest) {
      return responseFormatter(result);
    }
    return result.data;
  }

  /**
   * 删除索引
   * @param graphName 子图名称
   * @param params
   * @returns
   */
  async deleteIndex(graphName: string, params: IIndexParams) {
    const { labelName, propertyName } = params;
    const cypher = `CALL db.deleteIndex('${labelName}', '${propertyName}')`;
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }

  /**
   * 查询指定类型的索引列表
   * @param graphName 子图名称
   * @param labelName 类型名称
   * @returns
   */
  async queryIndexByLabel(graphName: string, labelName: string) {
    const cypher = `CALL db.listLabelIndexes('${labelName}')`;
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return result.data;
  }

  /**
   * 删除 schema
   * @param graphName 子图名称
   * @param labelName label 类型
   * @param labelName 类型名称
   */
  async deleteSchema(params: IDeleteSchemaParams) {
    const { labelType, labelName, graphName } = params;
    const type = labelType === 'node' ? 'vertex' : 'edge';
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: `CALL db.deleteLabel('${type}', '${labelName}')`,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }

  /**
   * 导入 Schema 创建图模型
   * @param params
   * @return
   */
  async importSchema(params: ISchemaParams) {
    const { graph, schema, override = false } = params;
    const result = await this.ctx.curl(`${EngineServerURL}/import_schema`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph,
        description: {
          schema,
        },
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }
}

export default TuGraphSchemaService;
