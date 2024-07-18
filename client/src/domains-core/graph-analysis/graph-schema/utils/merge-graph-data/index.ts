import { GraphData } from '@antv/g6';
import { uniqueElementsBy } from '@/domains-core/graph-analysis/graph-schema/utils/unique-elements-by';

/** 合并画布和接口数据 */
export const mergeGraphData = (
  data: GraphData = { nodes: [], edges: [] },
  responseData: any = { nodes: [], edges: [] },
) => {
  const { nodes = [], edges = [] } = responseData;
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
};
