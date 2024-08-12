import { GraphData, NodeData } from '@antv/g6';

/**
 *
 * @param graphData 画布数据
 * @param prop 节点/边属性
 * @param elementType 元素类型
 * @returns 图表数据
 */
export const getChartData = (
  graphData: GraphData,
  prop: string,
  elementType: 'node' | 'edge',
  currentValue?: string,
) => {
  let elements = elementType === 'node' ? graphData.nodes : graphData.edges;
  if (currentValue) {
    elements = elements?.filter(
      (item) => item.label === currentValue,
    ) as NodeData[];
  }

  const chartData = new Map<string, number>();
  elements?.forEach((e) => {
    if (e.properties && e.properties[prop] !== undefined) {
      const value: any = e.properties[prop];
      chartData.set(
        value,
        chartData.has(value) ? chartData.get(value)! + 1 : 1,
      );
    }
  });
  return chartData;
};
