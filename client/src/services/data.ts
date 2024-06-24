import { InitialState } from '@/app';
import { Session, session } from 'neo4j-driver';
import { useModel } from 'umi';
import { map, join, isString } from 'lodash';
import {
  createEdgeCypher,
  createNodeCypher,
  deleteEdgeCypher,
  deleteNodeCypher,
  updateNodeCypher,
} from '@/queries/data';
import { responseFormatter } from '@/utils/schema';
import { IEdgeDataParams, INodeDataParams } from './interface';

/* 创建会话 */
const getSession = (graphName = 'default') => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;
  return driver.session({
    database: graphName,
  });
};

const cypherValueFormatter = (value: any) => {
  return isString(value) ? `'${value}'` : value;
};

const edgeMatchConditionFormatter = (params: IEdgeDataParams) => {
  const {
    sourceLabel,
    targetLabel,
    sourcePrimaryKey,
    sourceValue,
    targetPrimaryKey,
    targetValue,
    labelName,
  } = params;
  const sourceValueString = cypherValueFormatter(sourceValue);
  const targetValueString = cypherValueFormatter(targetValue);

  return `MATCH (n:${sourceLabel} {${sourcePrimaryKey}: ${sourceValueString}})-[r:${labelName}]-(m:${targetLabel} {${targetPrimaryKey}: ${targetValueString}})`;
};

/* 创建节点 */
export const createNode = async (
  graphName: string,
  labelName: string,
  properties: Record<string, unknown>,
) => {
  const session = getSession(graphName);
  const keys = map(
    properties,
    (value: unknown, key: string) =>
      `${key}: ${!isString(value) ? value : "'" + value + "'"}`,
  );
  const cypher = createNodeCypher(labelName, join(keys, ', '));
  const result = await session.run(cypher);
  session.close;
  return responseFormatter(result);
};

/* 创建边 */
export const createEdge = async (params: IEdgeDataParams) => {
  const {
    graphName,
    sourceLabel,
    targetLabel,
    sourcePrimaryKey,
    sourceValue,
    targetPrimaryKey,
    targetValue,
    labelName,
    properties,
  } = params;
  const session = getSession(graphName);

  const sourceValueString = cypherValueFormatter(sourceValue);
  const targetValueString = cypherValueFormatter(targetValue);

  const keys = map(
    properties,
    (value: string, key: string) =>
      `${key}: ${!isString(value) ? value : "'" + value + "'"}`,
  );
  const propertyString = `{${join(keys, ', ')}}`;

  const cypher = createEdgeCypher(
    sourceLabel,
    targetLabel,
    sourcePrimaryKey,
    sourceValueString,
    targetPrimaryKey,
    targetValueString,
    labelName,
    propertyString,
  );

  const result = await session.run(cypher);
  session.close();
  return responseFormatter(result);
};

/* 删除节点 */
export const deleteNode = async (params: INodeDataParams) => {
  const { graphName, primaryKey, primaryValue, labelName } = params;
  const session = getSession(graphName);
  const cypher = deleteNodeCypher(
    labelName,
    primaryKey,
    cypherValueFormatter(primaryValue),
  );
  const result = await session.run(cypher);
  session.close();
  return responseFormatter(result);
};

/* 删除边 */
export const deleteEdge = async (params: IEdgeDataParams) => {
  const { graphName } = params;
  const session = getSession(graphName);

  const cypher = `${edgeMatchConditionFormatter(params)} DELETE r`;
  const result = await session.run(cypher);
  session.close();

  return responseFormatter(result);
};

/* 编辑节点 */
export const updateNode = async (params: INodeDataParams) => {
  const { graphName, primaryKey, primaryValue, properties, labelName } = params;
  const session = getSession(graphName);
  const propertiesString = map(
    properties,
    (value: unknown, key: string) =>
      `n.${key} = ${cypherValueFormatter(value)}`,
  ).join(',');
  const cypher = updateNodeCypher(
    labelName,
    primaryKey,
    cypherValueFormatter(primaryValue),
    propertiesString,
  );
  const result = await session.run(cypher);
  session.close();
  return responseFormatter(result);
};

/* 编辑边 */
export const updateEdge = async (params: IEdgeDataParams) => {
  const { graphName, properties } = params;
  const session = getSession(graphName);
  const propertiesString = map(
    properties,
    (value: unknown, key: string) =>
      `r.${key} = ${cypherValueFormatter(value)}`,
  ).join(',');
  const cypher = `${edgeMatchConditionFormatter(
    params,
  )} SET ${propertiesString}`;

  const result = await session.run(cypher);
  session.close();
  return responseFormatter(result);
};
