import {
  createEdge,
  createEdgeLabelByJson,
  createVertex,
  createVertexLabelByJson,
  deleteLabel,
  dropDB,
  edgeLabels,
  getCount,
  getEdgeSchema,
  getGraphSchema,
  getVertexSchema,
  queryVertexLabels,
} from '@/queries/schema';
import {
  formatEdgeSchemaResponse,
  formatVertexSchemaResponse,
  responseFormatter,
} from '@/utils/schema';
import { Driver } from 'neo4j-driver';
import {
  ICreateSchemaParams,
  IDeleteSchemaParams,
  ISchemaParams,
  Schema,
} from '@/types/services';
import { request } from '../request';
import { createIndex } from './IndexSchema';

/**
 * 统计点类型和边类型的数量
 * @returns
 */
const statisticsSchemaCount = async (driver: Driver, graphName: string) => {
  const cypher = getGraphSchema();
  const result = await request({ driver, cypher, graphName });

  if (!result?.success) {
    return {
      success: false,
      errorMessage: result?.errorMessage,
      data: {
        vertexLabels: 0,
        edgeLabels: 0,
      },
    };
  }
  let vertexLabels = 0;
  let edgeLabels = 0;
  result?.data?.[0]?.schema?.schema?.forEach(item => {
    if (item?.type === 'VERTEX') {
      vertexLabels++;
    } else if (item?.type === 'EDGE') {
      edgeLabels++;
    }
  });

  return {
    success: true,
    code: 200,
    data: {
      vertexLabels,
      edgeLabels,
    },
  };
};

/* 统计点边 */
export const getNodeEdgeStatistics = async (
  driver: Driver,
  graphName: string,
) => {
  // step1: 查询点边类型的数量，即 schema 中点边类型
  const schemaResult = await statisticsSchemaCount(driver, graphName);

  // step2: 查询数据库中点边的数量
  const result = await request({ driver, cypher: getCount(), graphName });
  const { data: labelData, success, code } = schemaResult;
  const { vertexLabels, edgeLabels } = labelData;
  const { data } = result;
  const vertexCount =
    data?.find((item: any) => item['type'] === 'vertex')['number'] || 0;
  const edgeCount =
    data?.find((item: any) => item['type'] === 'edge')['number'] || 0;

  return {
    success: true,
    data: {
      vertexLabels,
      edgeLabels,
      vertexCount,
      edgeCount,
    },
  };
};

/**
 * 根据类型和名称获取指定的 Schema 定义
 * @param labelType 类型
 * @param labelName 名称
 * @returns
 */
const querySchemaByLabel = async (
  driver: Driver,
  graphName: string,
  labelType: 'node' | 'edge',
  labelName: string,
) => {
  let cypher = '';
  if (labelType === 'node') {
    cypher = getVertexSchema(labelName);
  } else if (labelType === 'edge') {
    cypher = getEdgeSchema(labelName);
  }

  const result = await request({ driver, cypher, graphName });

  if (!result.success) {
    return {
      success: false,
      code: result.status,
      data: result?.data,
    };
  }

  if (labelType === 'node') {
    const vertexResponseData = formatVertexSchemaResponse(
      result?.data[0]?.schema,
    );

    return {
      success: true,
      data: {
        ...vertexResponseData,
      },
    };
  } else if (labelType === 'edge') {
    const edgeResponseData = formatEdgeSchemaResponse(result?.data[0]?.schema);

    return {
      success: true,
      data: {
        ...edgeResponseData,
      },
    };
  }
};

/* 获取所有边点类型 Schema 的信息 */
const queryVertexSchema = async (driver: Driver, graphName: string) => {
  // step1: 先获取所有边点类型
  const typeResult = await request({
    driver,
    cypher: queryVertexLabels(),
    graphName,
  });
  if (!typeResult?.success) {
    return [];
  }
  // step2: 根据获取到的点类型，再获取每个点类型的详细属性
  const vertexSchemaPromise = typeResult?.data?.map(async d => {
    const currentVertexSchema = await querySchemaByLabel(
      driver,
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
};

/**
 * 获取所有边类型 Schema 的信息
 *
 */
const queryEdgeSchema = async (driver: Driver, graphName: string) => {
  // step1: 先获取所有边类型
  const typeResult = await request({ driver, cypher: edgeLabels(), graphName });

  if (!typeResult.success) {
    return [];
  }

  // step2: 根据获取到的边类型，再获取每个边类型的详细属性
  const edgeSchemaPromise = typeResult?.data?.map(async d => {
    const currentEdgeSchema = await querySchemaByLabel(
      driver,
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
};

/* 获取Schema */
export const getSchema = async (
  driver: Driver,
  params: { graphName: string },
) => {
  const { graphName } = params;

  const vertexSchema = await queryVertexSchema(driver, graphName);
  const edgeSchema = await queryEdgeSchema(driver, graphName);

  return {
    code: 200,
    success: true,
    data: {
      nodes: vertexSchema,
      edges: edgeSchema,
    },
  };
};

/**
 * 创建 Schema
 * @param params
 * @returns
 */
export const createSchema = async (
  driver: Driver,
  params: ICreateSchemaParams,
) => {
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
    cypher = createVertex(labelName, primaryField, condition);
  } else if (labelType === 'edge') {
    cypher = createEdge(labelName, JSON.stringify(edgeConstraints), condition);
  }

  const result = await request({ driver, cypher, graphName });
  if (!result.success) {
    return {
      code: 200,
      errorMessage: result?.errorMessage,
      success: false,
    };
  }

  // 创建 Schema 后，如果有配置索引，还需要再创建索引
  if (indexs.length > 0) {
    // 配置了索引，则需要创建索引
    const indexPromise = indexs.map(async d => {
      // 主键即为索引，无需再创建
      if (d.propertyName !== primaryField) {
        const currentEdgeSchema = await createIndex(driver, graphName, d, true);
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
        errorMessage: `Schema 创建成功，但有部分索引创建失败，具体失败原因为：${indexError?.errorMessage}`,
      };
    }
  }
  return responseFormatter(result);
};

/**
 * 删除 schema
 * @param graphName 子图名称
 * @param labelName label 类型
 * @param labelName 类型名称
 */
export const deleteSchema = async (
  driver: Driver,
  params: IDeleteSchemaParams,
) => {
  const { labelType, labelName, graphName } = params;

  const type = labelType === 'node' ? 'vertex' : 'edge';
  const result = await request({
    driver,
    cypher: deleteLabel(type, labelName),
    graphName,
  });
  return responseFormatter(result);
};


/**
 * 导入 Schema 创建图模型
 * @param params
 * @return
 */
export const importSchemaMod = async (
  driver: Driver,
  params: ISchemaParams,
) => {
  const { graph: graphName, override = false,schema } = params;

  // 如果是覆盖，则需要先删除原有的 schema
  if (override) {
    const deleteSchemaResult = await request({
      driver,
      cypher: dropDB(),
      graphName,
    });

    if (!deleteSchemaResult.success) {
      return {
        success: false,
        data: null,
        errorMessage: deleteSchemaResult?.errorMessage,
      };
    }
  }

  const result = await importSchema(driver,schema,graphName);

  return result;
};


/* 导入Schema数据 */
const mapCypher = async (
  arr = [],
  idx = 0,
  driver: Driver,
  graphName: string,
) => {
  const res = await request({ driver, cypher: arr[idx], graphName });
  if (res?.success && idx <= arr.length - 2) {
    return await mapCypher(arr, idx + 1, driver, graphName);
  } else {
    return res;
  }
};

/* 导入schema */
export const importSchema = async (
  driver: Driver,
  Schema: Schema[],
  graphName: string,
) => {
  try {
    const cypherEdgeList: any = [];
    const cypherVertexList: any = [];
    Schema?.forEach(item => {
      if (item?.type === 'VERTEX') {
        cypherVertexList.push(createVertexLabelByJson(JSON.stringify(item)));
      } else if (item?.type === 'EDGE') {
        cypherEdgeList.push(createEdgeLabelByJson(JSON.stringify(item)));
      }
    });
    const result = await mapCypher(
      [...cypherVertexList, ...cypherEdgeList],
      0,
      driver,
      graphName,
    );
    return result;
  } catch (error) {
    return error;
  }
};
