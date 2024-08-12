import { EdgeData, Graph, NodeData } from '@antv/g6';

/** 设置指定点边状态 */
export const setGraphActiveStatus = (options: {
  graph?: Graph;
  nodes: NodeData[];
  edges: (EdgeData | string)[];
}) => {
  const { graph, nodes, edges } = options;
  if (graph) {
    graph.getNodeData().forEach((node) => {
      graph.setElementState(node.id, 'inactive');
    });
    graph.getEdgeData().forEach((edge) => {
      graph.setElementState(edge.id!, 'inactive');
    });
    nodes?.forEach((nodeItem) => {
      graph.setElementState(nodeItem.id!, 'active');
    });
    edges.forEach((edge) => {
      graph.setElementState(
        typeof edge === 'string' ? edge : edge.id!,
        'active',
      );
    });
  }
};
