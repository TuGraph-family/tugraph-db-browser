import {
  IConfigQueryParams,
  ILanguageQueryParams,
  INeighborsParams,
  INodeQueryParams,
  IPathQueryParams,
} from '@/types/services';
import { QueryResultFormatter, responseFormatter } from '@/utils/schema';
import {
  generateCypherByConfig,
  generateCypherByNode,
  generateCypherByPath,
} from '@/utils/query';
import { queryNeighborsCypher } from '@/queries/query';
import { request } from './request';
import { Driver } from 'neo4j-driver';

/* 使用 Cypher 语句查询，按标准的 Cypher 返回结果转换，不做过多处理，即如果只查询点，不会去查询子图 */
export const queryByGraphLanguage = async (
  driver: Driver,
  params: ILanguageQueryParams,
) => {
  const { graphName, script } = params;

  const result = await request({ driver, cypher: script, graphName });

  return QueryResultFormatter(result, script);
};

/**
 * 路径查询
 * @param params
 */
export const queryByPath = async (driver: Driver, params: IPathQueryParams) => {
  const { graphName } = params;
  const script = generateCypherByPath(params);
  const result = await request({ driver, cypher: script, graphName });

  return QueryResultFormatter(result, script);
};

/**
 * 节点查询
 * @param params
 */
export const queryByNode = async (driver: Driver, params: INodeQueryParams) => {
  const { graphName } = params;

  const script = generateCypherByNode(params);
  const result = await request({ driver, cypher: script, graphName });

  return QueryResultFormatter(result, script);
};

/**
 * 根据配置查询数据
 * @param params IConfigQueryParams
 * @returns
 */
export const queryByConfig = async (
  driver: Driver,
  params: IConfigQueryParams,
) => {
  const { graphName } = params;
  const script = generateCypherByConfig(params);
  const result = await request({ driver, cypher: script, graphName });
  return QueryResultFormatter(result, script);
};

/**
 * 邻居查询
 * @param params
 */
export const queryNeighbors = async (
  driver: Driver,
  params: INeighborsParams,
) => {
  const { graphName } = params;

  const cypher = queryNeighborsCypher(params);

  const result = await request({ driver, cypher, graphName });

  return QueryResultFormatter(result, cypher);
};

export const queryGetProcedureDemo = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request({ driver, cypher });

  return responseFormatter(result);
};

export const queryCallProcedures = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request({ driver, cypher });

  return responseFormatter(result);
};

export const queryDeleteProcedure = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request({ driver, cypher });

  return responseFormatter(result);
};

export const queryGetProcedures = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request({ driver, cypher });

  return responseFormatter(result);
};

export const queryGetvProcedures = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request({ driver, cypher });

  return responseFormatter(result);
};

export const queryUploadProcedure = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request({ driver, cypher });

  return responseFormatter(result);
};
