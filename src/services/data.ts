import { map, join, isString } from 'lodash';
import {
  createEdgeCypher,
  createNodeCypher,
  deleteNodeCypher,
  updateNodeCypher,
} from '@/queries/data';
import { responseFormatter } from '@/utils/schema';
import { IEdgeDataParams, INodeDataParams } from '@/types/services';
import { request } from './request';
import { Driver } from 'neo4j-driver';

/* 加引号 */
const cypherValueFormatter = (value: any) => {
  return isString(value) ? `'${value}'` : value;
};

/* 删除边的语句 */
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
  driver: Driver,
  params: {
    graphName: string;
    labelName: string;
    properties: Record<string, unknown>;
  },
) => {
  const { graphName, labelName, properties } = params;
  const keys = map(
    properties,
    (value: unknown, key: string) =>
      `${key}: ${!isString(value) ? value : "'" + value + "'"}`,
  );
  const cypher = createNodeCypher(labelName, join(keys, ', '));
  const result = await request({driver, cypher, graphName});
  return responseFormatter(result);
};

/* 创建边 */
export const createEdge = async (driver: Driver, params: IEdgeDataParams) => {
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

  const result = await request({driver, cypher, graphName});
  return responseFormatter(result);
};

/* 删除节点 */
export const deleteNode = async (driver: Driver, params: INodeDataParams) => {
  const { graphName, primaryKey, primaryValue, labelName } = params;
  const cypher = deleteNodeCypher(
    labelName,
    primaryKey,
    cypherValueFormatter(primaryValue),
  );
  const result = await request({driver, cypher, graphName});
  return responseFormatter(result);
};

/* 删除边 */
export const deleteEdge = async (driver: Driver, params: IEdgeDataParams) => {
  const { graphName } = params;

  const cypher = `${edgeMatchConditionFormatter(params)} DELETE r`;
  const result = await request({driver, cypher, graphName});

  return responseFormatter(result);
};

/* 编辑节点 */
export const updateNode = async (driver: Driver, params: INodeDataParams) => {
  const { graphName, primaryKey, primaryValue, properties, labelName } = params;
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
  const result = await request({driver, cypher, graphName});
  return responseFormatter(result);
};

/* 编辑边 */
export const updateEdge = async (driver: Driver, params: IEdgeDataParams) => {
  const { graphName, properties } = params;
  const propertiesString = map(
    properties,
    (value: unknown, key: string) =>
      `r.${key} = ${cypherValueFormatter(value)}`,
  ).join(',');
  const cypher = `${edgeMatchConditionFormatter(
    params,
  )} SET ${propertiesString}`;

  const result = await request({driver, cypher, graphName});
  return responseFormatter(result);
};
