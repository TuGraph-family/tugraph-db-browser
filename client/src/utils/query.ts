// @ts-nocheck

import {
  Condition,
  INodeQueryParams,
  IPathQueryParams,
  IConfigQueryParams,
} from '@/types/services';

import {  map, isEmpty } from 'lodash';







export const conditionToCypher = (conditions: Condition[]) => {
  return map(conditions, (cond: Condition) => {
    const { property, value, operator } = cond;
    if (typeof value === 'boolean') {
      return value
        ? `${property}${operator}TRUE`
        : `${property}${operator}FALSE`;
    }

    if (typeof value === 'number') {
      return `${property}${operator}${value}`;
    }

    return `${property}${operator}'${value}'`;
  });
};

/**
 * 根据路径转换路径查询的 Cypher 语句
 * @param params IPathQueryParams
 * @return
 */
export const generateCypherByPath = (params: IPathQueryParams) => {
  const { path, conditions, limit } = params;
  if (isEmpty(conditions)) {
    return `MATCH p=${path} RETURN p LIMIT ${limit}`;
  }
  const conditionScripts = conditionToCypher(conditions);

  return `MATCH p=${path} WHERE  ${conditionScripts.join(
    ' AND '
  )} RETURN p LIMIT ${limit}`;
};

/**
 * 根据节点转换路径查询的 Cypher 语句
 * @param params IPathQueryParams
 * @return
 */
export const generateCypherByNode = (params: INodeQueryParams) => {
  const { nodes, conditions, limit } = params;

  const nodesIndex: string[] = [];
  const nodesScripts = map(nodes, (node: string, index: number) => {
    const nodeIndex = `n${index}`;
    nodesIndex.push(nodeIndex);
    return `(${nodeIndex}:${node})`;
  });

  if (isEmpty(conditions)) {
    return `MATCH ${nodesScripts.join(',')}  RETURN ${nodesIndex.join(
      ','
    )} LIMIT ${limit}`;
  }

  const conditionScripts = conditionToCypher(conditions);

  return `MATCH ${nodesScripts.join(',')} WHERE  ${conditionScripts.join(
    ' AND '
  )} RETURN ${nodesIndex.join(',')} LIMIT ${limit}`;
};

/**
 * 根据配置转换查询的 Cypher 语句
 * @param params IConfigQueryParams
 * @return
 */
export const generateCypherByConfig = (params: IConfigQueryParams) => {
  const { nodeType, conditions, limit } = params;
  if (isEmpty(conditions)) {
    return `MATCH (n: ${nodeType}) RETURN n LIMIT ${limit}`;
  }
  const conditionScripts = conditionToCypher(conditions);

  return `MATCH (n: ${nodeType}) WHERE  ${conditionScripts.join(
    ' AND '
  )} RETURN n LIMIT ${limit}`;
};
