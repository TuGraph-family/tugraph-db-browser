import { map } from 'lodash';
import { SubGraph } from '../interface/graph';

export const getGraphListTranslator = (graphList: SubGraph[]) => {
  if (graphList?.length === 0) {
    return [];
  }
  return map(graphList, (graph: SubGraph) => {
    return {
      isStatistics: false,
      description: graph.configuration?.description,
      maxSizeGB: graph.configuration?.max_size_GB,
      graphName: graph.graph_name,
      nodeEdgeStats: {},
      isNodeEdgeObj: false,
    };
  });
};
