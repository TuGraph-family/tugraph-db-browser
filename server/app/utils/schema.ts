import { IVertextSchemaParams, IEdgeSchemaParams, ISchemaParams } from './interface';
/**
 * 转换使用 Cypher 查询节点 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatVertexSchemaResponse = (params: IVertextSchemaParams) => {
  return params;
};

/**
 * 转换使用 Cypher 查询边 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatEdgeSchemaResponse = (params: IEdgeSchemaParams) => {
  return params;
};

/**
 * 转换使用 Cypher 查询子图 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatSchemaResponse = (params: ISchemaParams) => {
  return params;
};
