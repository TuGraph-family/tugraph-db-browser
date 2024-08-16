// @ts-nocheck

import {
  IVertextSchemaParams,
  IEdgeSchemaParams,
  RestFulResponse,
  IDuplicatesData,
} from '@/types/services';
import { isNode, isPath, isRelationship } from 'neo4j-driver';
import { isEmpty } from 'lodash';
import { formatCypherResult } from '@/translator';
/**
 * 转换使用 Cypher 查询节点 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatVertexSchemaResponse = (params: IVertextSchemaParams) => {
  const { label, properties, primary } = params;
  const formatterProperties: any = [];
  const index: any = [];

  properties.forEach(item => {
    formatterProperties.push({
      name: item.name,
      type: item.type,
      optional: item.optional,
    });
    if (item.index) {
      index.push({
        labelName: label,
        propertyName: item.name,
        isUnique: item.unique,
      });
    }
  });

  return {
    labelName: label,
    labelType: 'node',
    properties: formatterProperties,
    primaryField: primary,
    index,
  };
};

/**
 * 转换使用 Cypher 查询边 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatEdgeSchemaResponse = (params: IEdgeSchemaParams) => {
  const { constraints, label, properties } = params;
  return {
    edgeConstraints: constraints,
    labelName: label,
    labelType: 'edge',
    properties,
  };
};

export const responseFormatter = (result: RestFulResponse) => {
  if (!result.success) {
    return {
      success: false,
      data: null,
      errorMessage: result?.errorMessage,
    };
  }
  const resultData =
    result?.data?.data?.result || result?.data?.data || result?.data || {};
  return {
    success: true,
    data: resultData,
  };
};

/**
 * 转换使用 Cypher 查询节点返回的数据格式
 * @param params
 * @return
 */
export const formatVertexResponse = (
  params: IVertextParams[],
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
        const hasSourceNode = nodes.find(d => d.id === `${src}`);
        if (!hasSourceNode) {
          nodes.push({
            id: `${src}`,
            label: 'UNKNOW',
            properties: null,
          });
        }
        const hasTargetNode = nodes.find(d => d.id === `${dst}`);

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
  }[],
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
    pnodes.map(d => {
      return {
        n: d,
      };
    }) as unknown as IVertextParams[],
  );

  const { edges } = formatEdgeResponse(
    pedges.map(d => {
      return {
        e: d,
      };
    }) as unknown as IEdgeParams[],
  );

  return {
    nodes,
    edges,
    // paths 格式先不转换，到时候按需要再处理
    paths,
  };
};

// 去重函数
const removeDuplicates = (data: IDuplicatesData[]) => {
  return data.filter((item, index, self) => {
    return index === self.findIndex(t => t.id === item.id);
  });
};

/**
 * 转换使用 Cypher 查询节点、边、path等多元素时返回的数据格式
 * @param params
 * @return
 */
export const formatMultipleResponse = (params: IMultipleParams[]) => {
  const nodes: IVertextParams[] = [];
  const edges: IEdgeParams[] = [];
  for (const multi of params) {
    for (const key in multi) {
      const current = multi[key];

      switch (true) {
        case isNode(current):
          nodes.push({
            id: current.elementId,
            label: current.labels[0],
            ...current,
          });
          break;
        case isRelationship(current):
          edges.push({
            id: `edges_${current.startNodeElementId}_${current.endNodeElementId}_${current.elementId}`,
            source: current.startNodeElementId,
            target: current.endNodeElementId,
            label: current.type,
            properties: current.properties,
          });
          break;
        case isPath(current):
          const result = formatMultipleResponse(current.segments);
          nodes.push(...result.nodes);
          edges.push(...result.edges);
        default:
          break;
      }
    }
  }

  const newNodes = removeDuplicates(nodes);
  const newEdges = removeDuplicates(edges);

  return {
    nodes: newNodes,
    edges: newEdges,
  };
};

export const QueryResultFormatter = (
  result: RestFulResponse,
  script: string,
) => {
  if (!result.success) {
    return {
      code: 200,
      errorMessage: result?.errorMessage,
      success: false,
    };
  }
  const resultData = formatCypherResult(result.data) ;
  const responseData = formatCypherResult(formatMultipleResponse(result.data));

  const { edges, nodes } = responseData;

  return {
    data: {
      originalData: resultData,
      formatData:
        isEmpty(edges) && isEmpty(nodes)
          ? {
              nodes: [],
              edges: [],
            }
          : {
              edges,
              nodes,
            },
    },
    script,
    code: 200,
    success: true,
  };
};
