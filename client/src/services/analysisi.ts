import { Driver } from 'neo4j-driver';
import { request } from './request';
import {
  pathQueryCypher,
  quickQueryCypher,
  queryNeighborsCypher,
} from '@/queries/analysis';
import { QueryResultFormatter, responseFormatter } from '@/utils/schema';
import { getGraphSchema } from '@/queries/schema';
import { convertIntToNumber } from '@/translator';

/* 节点扩展 */
export const queryNeighbors = async (
  driver: Driver,
  params: {
    graphName: string;
    sep?: number;
    id?: string;
  },
) => {
  const { graphName, id, sep } = params;
  const cypher = queryNeighborsCypher({
    id,
    sep,
  });
  const result = await request({ driver, cypher, graphName });

  if (!result.success) {
    return result;
  }
  const {
    data: { formatData = [] },
  } = QueryResultFormatter(result, cypher) || {};

  return {
    success: true,
    graphData: convertIntToNumber(formatData) 
  }
};

/* 配置查询 */
export const quickQuery = async (
  driver: Driver,
  params: {
    graphName: string;
    limit?: number;
    rules?: any;
    node: string;
  },
) => {
  const { graphName, node, rules, limit } = params;
  const cypher = quickQueryCypher({
    node,
    rules,
    limit,
  });
  const result = await request({ driver, cypher, graphName });
  if (!result.success) {
    return result;
  }
  const {
    data: { formatData = [] },
  } = QueryResultFormatter(result, cypher) || {};

  return {
    success: true,
    graphData: convertIntToNumber(formatData) 
  }
};

/* 路径查询 */
export const pathQuery = async (
  driver: Driver,
  params: {
    graphName: string;
    start: { node: string; property: string };
    end: { node: string; property: string };
    depth: number;
  },
) => {
  const { graphName, start, end, depth } = params;

  const cypher = pathQueryCypher({
    start,
    end,
    depth,
  });
  const result = await request({ driver, cypher, graphName });

  return responseFormatter(result);
};

/* 获取schema */
export const getSchema = async (
  driver: Driver,
  params: {
    graphName: string;
  },
) => {
  const { graphName } = params;
  const cypher = getGraphSchema();
  const result = await request({ driver, cypher, graphName });

  return responseFormatter(result);
};
