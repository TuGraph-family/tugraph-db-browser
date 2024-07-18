import { GraphData } from '@antv/g6';

/**
 *
 * @param graphData 画布数据
 * @param prop 节点/边属性
 * @param elementType 元素类型
 * @returns 直方图图表数据
 */
export const getHistogramData = (
  graphData: GraphData,
  prop: string,
  elementType: 'node' | 'edge',
) => {
  const elements = elementType === 'node' ? graphData.nodes : graphData.edges;
  const data = elements
    ?.filter((e) => e.properties && e.properties[prop])
    .map((e) => ({ value: e.properties?.[prop] as number }));
  data?.sort((a, b) => a.value! - b.value!);
  return data;
};
