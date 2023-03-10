import { IVertextParams, IEdgeParams, IPathParams, IMultipleParams, IPropertiesParams, ISubGraphParams, IVertexResponse, IEdgeResponse } from './interface';

/**
 * 转换使用 Cypher 查询节点返回的数据格式
 * @param params
 * @return
 */
export const formatVertexResponse = (params: IVertextParams[]): IVertexResponse[] => {
  const nodes: IVertexResponse[] = [];
  for (const vertex of params) {
    for (const key in vertex) {
      const current = vertex[key];
      const { identity, ...others } = current;
      const has = nodes.find((d: any) => d.id === `${identity}`);
      if (!has) {
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
  for (const edge of params) {
    for (const key in edge) {
      const current = edge[key];
      const { identity, src, dst, label_id, temporal_id, forward, ...others } = current;
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
      }
    }
  }

  return edges;
};

/**
 * 转换使用 Cypher 查询路径返回的数据格式
 * @param params
 * @return
 */
export const formatPathResponse = (params: IPathParams[]) => {
  const pnodes: IVertextParams[] = [];
  const pedges: IEdgeParams[] = [];
  for (const path of params) {
    for (const key in path) {
      const currentPath = path[key];
      for (const cp of currentPath) {
        const { identity, src, dst, label_id, temporal_id } = cp;
        // src & dst 都存在，则为边
        if (src === 0 || src && dst) {
          const edgeId = `${src}_${label_id}_${temporal_id}_${dst}_${identity}`;
          const hasEdge = pedges.find((d: any) => d.id === `${edgeId}`);
          if (!hasEdge) {
            pedges.push({
              e: cp as any,
            });
          }
        } else {
          // 否则为节点
          const hasNode = pnodes.find((d: any) => d.id === `${identity}`);
          if (!hasNode) {
            pnodes.push({
              n: cp,
            });
          }
        }
      }
    }
  }
	
  const nodes = formatVertexResponse(pnodes);
  const edges = formatEdgeResponse(pedges);
  return {
    nodes,
    edges,
  };
};

/**
 * 转换使用 Cypher 查询节点、边、path等多元素时返回的数据格式
 * @param params
 * @return
 */
export const formatMultipleResponse = (params: IMultipleParams) => {
  return params;
};

/**
 * 转换使用 Cypher 查询属性返回的数据格式
 * @param params
 * @return
 */
export const formatPropertiesResponse = (params: IPropertiesParams) => {
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
