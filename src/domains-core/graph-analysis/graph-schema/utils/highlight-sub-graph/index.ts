import { Graph, GraphData } from '@antv/g6';

/**
 *高亮选中的节点和边
 * @param graph G6 graph 实例
 * @param data 子图数据
 * @returns
 */
export const highlightSubGraph = (graph: Graph, data: GraphData) => {
  if (!graph || graph.destroyed) return {};
  const source = graph.getData() as GraphData;

  const nodeIds = data.nodes?.map((node) => node.id);
  const edgeIds: string[] = [];
  /** 需要考虑聚合边的情况，需要构造全量的边 */
  data.edges?.forEach((edge) => {
    edgeIds.push(edge.id!);
  });

  const sourceNodesCount = source.nodes?.length;
  const sourceEdgesCount = edgeIds.length; //考虑聚合边
  const nodesCount = data.nodes?.length;
  const edgesCount = data.edges?.length;
  const isEmpty = nodesCount === 0 && edgesCount === 0;
  const isFull =
    nodesCount === sourceNodesCount && edgesCount === sourceEdgesCount;
  // 如果是空或者全部图数据，则恢复到画布原始状态，取消高亮
  if (isEmpty || isFull) {
    source.nodes?.forEach(function (node) {
      graph.setElementState(node.id, []);
    });
    source.edges?.forEach(function (edge) {
      graph.setElementState(edge.id!, []);
    });
    return { isEmpty, isFull };
  }

  source.nodes?.forEach((node) => {
    const hasMatch = nodeIds?.includes(node.id);
    if (hasMatch) {
      graph.setElementState(node.id, ['active'], true);
    }
  });
  source.edges?.forEach((edge) => {
    const { id } = edge;

    /** 考虑聚合边的情况，aggregate 数据中的 edgeId 匹配上一个就可以高亮整个聚合边 */

    const hasMatch = edgeIds.includes(id!);

    if (hasMatch) {
      graph.setElementState(edge.id!, ['active'], true);
    }
  });
  return {
    isEmpty,
    isFull,
  };
};
