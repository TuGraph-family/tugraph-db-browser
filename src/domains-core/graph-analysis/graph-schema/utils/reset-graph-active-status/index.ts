import { Graph } from '@antv/g6';

/** 清空画布点边状态 */
export const resetGraphActiveStatus = (graph?: Graph) => {
  if (graph) {
    graph.getNodeData().forEach((node) => {
      graph.setElementState(node.id, []);
    });
    graph.getEdgeData().forEach((edge) => {
      graph.setElementState(edge.id!, []);
    });
  }
};
