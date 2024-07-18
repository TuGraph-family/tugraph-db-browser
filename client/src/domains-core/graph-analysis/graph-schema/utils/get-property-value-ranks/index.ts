import { GraphData } from '@antv/g6';
import { SPLITTER } from '@/domains-core/graph-analysis/graph-schema/constants/index';

/**
 * 筛选出计算一个属性的所有属性值的排序，若一个属性值是 outlier，则 rank 为 0，即最重要
 * @param propertyGraphData 属性图数据
 * @param itemType 图元素类型，节点或边
 * @param propertyName 属性名称
 * @returns
 */
export const getPropertyValueRanks = (
  propertyGraphData: GraphData | undefined,
  itemType: 'node' | 'edge',
  propertyName: string,
): {
  propertyValue: unknown;
  rank: number;
  isOutlier?: boolean;
}[] => {
  if (!propertyGraphData) return [];
  const valueRanks: {
    propertyValue: unknown;
    rank: number;
    isOutlier?: boolean;
  }[] = [];
  propertyGraphData.nodes?.forEach((propertyValueNode) => {
    const { id, rank, isOutlier } = propertyValueNode as any;
    const [iType, pName, pValue] = id.split(SPLITTER);
    if (propertyName === 'id' || iType !== itemType || pName !== propertyName)
      return [];
    valueRanks.push({
      propertyValue: pValue,
      rank: isOutlier ? 0 : rank,
      isOutlier,
    });
  });
  return valueRanks;
};
