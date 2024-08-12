import { GraphData, NodeData } from '@antv/g6';

/** 注入点边的schema样式 */
export const getStyledGraphData = (options: {
  graphData?: GraphData | API.AggregatedResultVO;
  graphSchemaStyle: Record<string, NodeData['style']>;
}) => {
  const { graphData, graphSchemaStyle } = options;
  const { nodes, edges } = graphData || {};
  if (graphSchemaStyle) {
    return {
      nodes: nodes?.map((item) => {
        return {
          ...item,
          style: graphSchemaStyle?.[item.label as string],
        };
      }),
      edges: edges?.map((item) => {
        return {
          ...item,
          style: graphSchemaStyle?.[item.label as string],
        };
      }),
    } as GraphData;
  } else {
    return graphData as GraphData;
  }
};
