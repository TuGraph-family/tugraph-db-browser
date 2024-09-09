import { TypePropertyCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { filterByPropertyCondition } from '@/domains-core/graph-analysis/graph-schema/utils/filter-by-property-condition';

export const filterByTopRule = (
  data: Record<string, any>,
  rule: TypePropertyCondition,
): boolean => {
  const { type, conditions } = rule;
  // 未配置规则一律通过
  if (conditions.length === 0) {
    return true;
  }

  return conditions.some(
    (item) =>
      data.label === type && filterByPropertyCondition(data.properties, item),
  );
};
