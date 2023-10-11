import {
  Condition,
  INodeQueryParams,
  IPathQueryParams,
  IVertextParams,
  IEdgeParams,
  IPathParams,
  IMultipleParams,
  IPropertiesParams,
  ISubGraphParams,
  IVertexResponse,
  IEdgeResponse,
  IConfigQueryParams,
} from '../service/tugraph/interface';

import { find, has, map, isEmpty } from 'lodash';

/**
 * 转换使用 Cypher 查询节点返回的数据格式
 * @param params
 * @return
 */
export const formatVertexResponse = (
  params: IVertextParams[]
): IVertexResponse[] => {
  const nodes: IVertexResponse[] = [];
  for (const vertex of params) {
    for (const key in vertex) {
      const current = vertex[key];
      const { identity, ...others } = current;
      const hasNode = nodes.find((d: any) => d.id === `${identity}`);
      if (!hasNode) {
        nodes.push({
          ...others,
          id: `${identity}`,
        });
      }
    }
  }

  return nodes;
};

/**
 * 转换使用 Cypher 查询边返回的数据格式
 * @param params
 * @return
 */
export const formatEdgeResponse = (params: IEdgeParams[]) => {
  const edges: IEdgeResponse[] = [];
  const nodes: IVertexResponse[] = [];
  for (const edge of params) {
    for (const key in edge) {
      const current = edge[key];
      const { identity, src, dst, label_id, temporal_id, forward, ...others } =
        current;
      const edgeId = `${src}_${label_id}_${temporal_id}_${dst}_${identity}`;
      const hasEdge = edges.find((d: any) => d.id === `${edgeId}`);
      if (!hasEdge) {
        edges.push({
          ...others,
          source: `${src}`,
          target: `${dst}`,
          direction: forward ? 'OUT' : 'IN',
          id: `${src}_${label_id}_${temporal_id}_${dst}_${identity}`,
        });

        // 如果只是边，则还需要将起点和终点添加到 nodes 中
        const hasSourceNode = nodes.find((d) => d.id === `${src}`);
        if (!hasSourceNode) {
          nodes.push({
            id: `${src}`,
            label: 'UNKNOW',
            properties: null,
          });
        }
        const hasTargetNode = nodes.find((d) => d.id === `${dst}`);

        if (!hasTargetNode) {
          nodes.push({
            id: `${dst}`,
            label: 'UNKNOW',
            properties: null,
          });
        }
      }
    }
  }

  return {
    edges,
    nodes,
  };
};

/**
 * 转换使用 Cypher 查询路径返回的数据格式
 * @param params
 * @return
 */
export const formatPathResponse = (
  params: {
    [key: string]: IPathParams[];
  }[]
) => {
  const pnodes: IVertextParams[] = [];
  const pedges: IEdgeParams[] = [];
  const paths: IPathParams[][] = [];
  for (const path of params) {
    for (const key in path) {
      const currentPath = path[key];
      for (const cp of currentPath) {
        const { identity, src, dst, label_id, temporal_id, label } = cp;
        // src & dst 都存在，则为边
        if (src === 0 || dst === 0 || (src && dst)) {
          const edgeId = `${src}_${label_id}_${temporal_id}_${dst}_${identity}`;
          const hasEdge = pedges.find((d: any) => d.id === edgeId);
          if (!hasEdge) {
            pedges.push({
              ...cp,
              id: edgeId,
            } as unknown as IEdgeParams);
          }
        } else if (label) {
          // 否则为节点
          const hasNode = pnodes.find((d: any) => d.identity === identity);
          if (!hasNode) {
            pnodes.push(cp as unknown as IVertextParams);
          }
        }
      }
      // path
      paths.push(currentPath);
    }
  }

  const nodes = formatVertexResponse(
    pnodes.map((d) => {
      return {
        n: d,
      };
    }) as unknown as IVertextParams[]
  );

  const { edges } = formatEdgeResponse(
    pedges.map((d) => {
      return {
        e: d,
      };
    }) as unknown as IEdgeParams[]
  );

  return {
    nodes,
    edges,
    // paths 格式先不转换，到时候按需要再处理
    paths,
  };
};

/**
 * 转换使用 Cypher 查询节点、边、path等多元素时返回的数据格式
 * @param params
 * @return
 */
export const formatMultipleResponse = (params: IMultipleParams[]) => {
  const nodes: IVertextParams[] = [];
  const edges: IEdgeParams[] = [];
  const paths: any = [];
  const properties: IPropertiesParams[] = [];
  for (const multi of params) {
    for (const key in multi) {
      const current = multi[key];
      // Vertex 和 edge 为 object，path 为 array，其他为 string 或 number
      if (Object.prototype.toString.call(current) === '[object Array]') {
        // path
        paths.push({
          p: current as any,
        });
      } else if (
        Object.prototype.toString.call(current) === '[object Object]'
      ) {
        // vertex or edge
        const { identity, src, dst, label_id, temporal_id, label } = current;
        // src & dst 都存在，则为边
        if (has(current, 'src') && has(current, 'dst')) {
          const edgeId = `${src}_${label_id}_${temporal_id}_${dst}_${identity}`;
          const hasEdge = find(edges, (d: any) => d.id === edgeId);
          if (!hasEdge) {
            edges.push({
              ...current,
              id: edgeId,
            });
          }
        } else if (label) {
          // 否则为节点
          const hasNode = find(nodes, (d: any) => d.identity === identity);
          if (!hasNode) {
            nodes.push(current);
          }
        }
      } else {
        // string boolean number 不做区分
        properties.push({
          [key]: current,
        });
      }
    }
  }

  const multiNodes = formatVertexResponse(
    nodes.map((d) => {
      return {
        n: d,
      };
    }) as unknown as IVertextParams[]
  );

  const { edges: multiEdges } = formatEdgeResponse(
    edges.map((d) => {
      return {
        e: d,
      };
    }) as unknown as IEdgeParams[]
  );

  const multiNodeIds = multiNodes.map((d) => d.id);
  const multiEdgeIds = multiEdges.map((d) => d.id);
  const {
    nodes: graphNodes,
    edges: graphEdges,
    paths: graphPaths,
  } = formatPathResponse(paths);

  graphNodes.forEach((d) => {
    if (!multiNodeIds.includes(d.id)) {
      multiNodes.push(d);
    }
  });

  graphEdges.forEach((d) => {
    if (!multiEdgeIds.includes(d.id)) {
      multiEdges.push(d);
    }
  });

  return {
    nodes: multiNodes,
    edges: multiEdges,
    paths: graphPaths,
    properties,
  };
};

/**
 * 转换使用 Cypher 查询属性返回的数据格式
 * @param params
 * @return
 */
export const formatPropertiesResponse = (params: IPropertiesParams[]) => {
  return params;
};

/**
 * 转换使用 Cypher 查询子图返回的数据格式
 * @param params
 * @return
 */
export const formatSubGraphResponse = (params: ISubGraphParams) => {
  return params;
};

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