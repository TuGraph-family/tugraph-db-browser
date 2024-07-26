import { uniqueElementsBy } from '@/domains-core/graph-analysis/graph-schema/utils/unique-elements-by';
import { GraphData } from '@antv/g6';

/** 合并画布和接口数据 */
export const mergeGraphData = (
  data: GraphData = { nodes: [], edges: [] },
  responseData: any = { nodes: [], edges: [] },
) => {
  const { nodes = [], edges = [] } = responseData;
  if (
    data.nodes?.length &&
    data.edges?.length &&
    responseData?.nodes?.length &&
    responseData?.edges?.length
  ) {
    const graphData: GraphData = {
      ...data,
      nodes: uniqueElementsBy([...data.nodes!, ...nodes], (a, b) => {
        return a.id === b.id;
      }),
      edges: uniqueElementsBy([...data.edges!, ...edges], (a, b) => {
        if (a.id && b.id) {
          return a.id === b.id;
        }
        return a.source === b.source && a.target === b.target;
      }),
    };
    return graphData;
  } else {
    return { ...responseData };
  }
};
