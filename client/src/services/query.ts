import {
  IConfigQueryParams,
  ILanguageQueryParams,
  INeighborsParams,
  INodeQueryParams,
  IPathQueryParams,
} from './interface';
import { useModel } from 'umi';
import { InitialState } from '@/app';
import { QueryResultFormatter } from '@/utils/schema';
import {
  generateCypherByConfig,
  generateCypherByNode,
  generateCypherByPath,
} from '@/utils/query';
import { queryNeighborsCypher } from '@/queries/query';

/* 创建会话 */
const getSession = (graphName = 'default') => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;
  return driver.session({
    database: graphName,
  });
};

/* 使用 Cypher 语句查询，按标准的 Cypher 返回结果转换，不做过多处理，即如果只查询点，不会去查询子图 */
export const queryByGraphLanguage = async (params: ILanguageQueryParams) => {
  const { graphName, script } = params;
  const session = getSession(graphName);

  const result = await session.run(script);
  session.close();

  return QueryResultFormatter(result, script);
};

/**
 * 路径查询
 * @param params
 */
export const queryByPath = async (params: IPathQueryParams) => {
  const { graphName } = params;
  const session = getSession(graphName);
  const script = generateCypherByPath(params);
  const result = await session.run(script);
  session.close();

  return QueryResultFormatter(result, script);
};

/**
 * 节点查询
 * @param params
 */
export const queryByNode = async (params: INodeQueryParams) => {
  const { graphName } = params;

  const session = getSession(graphName);
  const script = generateCypherByNode(params);
  const result = await session.run(script).finally(() => session.close());

  return QueryResultFormatter(result, script);
};

/**
 * 根据配置查询数据
 * @param params IConfigQueryParams
 * @returns
 */
export const queryByConfig = async (params: IConfigQueryParams) => {
  const { graphName } = params;
  const session = getSession(graphName);
  const script = generateCypherByConfig(params);
  const result = await session.run(script).finally(() => session.close());
  return QueryResultFormatter(result, script);
};

/**
 * 邻居查询
 * @param params
 */
export const queryNeighbors = async (params: INeighborsParams) => {
  const { graphName } = params;
  const session = getSession(graphName);

  const cypher = queryNeighborsCypher(params);

  const result = await session.run(cypher);
  session.close()
  return QueryResultFormatter(result, cypher);
};
