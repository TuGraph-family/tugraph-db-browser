import { SPLITTER } from '@/domains-core/graph-analysis/graph-schema/constants';
import { GraphSchema } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { GraphData } from '@antv/g6';

/**
 * 将图数据转换为属性图，一个属性值为一个节点，边将其连接到对应的 id 属性点上
 * 并统计每个属性值在该属性下的概率，即 （属性 A 值为 '1' 出现次数 / 属性 A 的所有值出现总次数）
 * @param graphData
 * @returns
 */
export const graphData2PropertyGraph = (
  graphData: GraphData,
  schemaData: GraphSchema,
) => {
  const typeKeyMap = {
    node: 'nodeType',
    edge: 'edgeType',
  };
  const schemaTypePropertiesMap: {
    node: Record<string, any>;
    edge: Record<string, any>;
  } = {
    node: {},
    edge: {},
  };
  schemaData.nodes.forEach((node) => {
    const { nodeType, properties } = node;
    schemaTypePropertiesMap.node[nodeType] = properties;
  });
  schemaData.edges.forEach((edge) => {
    const { edgeType, properties } = edge;
    schemaTypePropertiesMap.edge[edgeType] = properties;
  });

  const propertyLinks: {
    source: string;
    target: string;
  }[] = [];
  const propertyValueMap: Record<string, any> = {};

  ['node', 'edge'].forEach((itemType) => {
    const items = graphData[`${itemType}s` as 'nodes' | 'edges'];
    const dataTypeKey = typeKeyMap[itemType as 'node'];
    items?.forEach((item) => {
      const { id, ...others } = item;

      const dataType = item[dataTypeKey];
      const schemaProperties =
        schemaTypePropertiesMap[itemType as 'node'][dataType as string];

      const idKey = `${itemType}${SPLITTER}id${SPLITTER}${id}`;
      propertyValueMap[idKey] = {
        name: 'id',
        value: id,
        count: 1,
      };

      Object.keys(others).forEach((pname) => {
        if (schemaProperties && !schemaProperties.hasOwnProperty(pname)) return;
        const pvalue = others[pname];
        const key = `${itemType}${SPLITTER}${pname}${SPLITTER}${pvalue}`;
        if (propertyValueMap.hasOwnProperty(key)) {
          propertyValueMap[key].count++;
        } else {
          propertyValueMap[key] = {
            name: pname,
            value: pvalue,
            count: 1,
          };
        }
        propertyLinks.push({
          source: idKey,
          target: key,
        });
      });
    });
  });

  // 计算每一属性值 count 数的个数
  const propertyCountCount: {
    [propertyKey: string]: {
      [count: number]: number;
      numberOfCount: number; // 一个属性值出现「次数」的可能性个数
      total: number; // 总属性值个数
      ave: number;
      hasOrdinary: boolean;
      valueRatios: { id: string; ratio: number }[];
      valueRankMap: { [id: string]: number };
    };
  } = {};
  Object.keys(propertyValueMap).forEach((propertyValueKey) => {
    const [itemType, propertyName] = propertyValueKey.split(SPLITTER);

    const { count } = propertyValueMap[propertyValueKey];

    const propertyKey = `${itemType}${SPLITTER}${propertyName}`;
    propertyCountCount[propertyKey] = propertyCountCount[propertyKey] || {
      total: 0,
      numberOfCount: 0,
      valueRatios: [],
      valueRankMap: {},
    };
    propertyCountCount[propertyKey][count] =
      propertyCountCount[propertyKey][count] || 0;
    propertyCountCount[propertyKey][count]++;
    propertyCountCount[propertyKey].numberOfCount++;
    propertyCountCount[propertyKey].total += count;
  });

  const properties: {
    id: string;
    propertyName: string;
    propertyValue: unknown;
    ratio: number;
    isOrdinary: boolean;
    hasOrdinary?: boolean;
    isOutlier?: boolean;
    rank?: number;
  }[] = Object.keys(propertyValueMap).map((propertyValueKey) => {
    const [itemType, propertyName, propertyValue] =
      propertyValueKey.split(SPLITTER);
    const propertyKey = `${itemType}${SPLITTER}${propertyName}`;

    const { numberOfCount, total } = propertyCountCount[propertyKey];

    const { count } = propertyValueMap[propertyValueKey];

    // 若这个属性值的出现「次数」非常多，大于该属性所有值出现「次数」的 90%，则认为这个值是一平凡的属性值，其余的为异常值
    const isOrdinary =
      propertyCountCount[propertyKey][count] > numberOfCount * 0.5;
    // 若存在平凡的属性值，这个属性的重要性则参考异常值而非信息量
    propertyCountCount[propertyKey].hasOrdinary =
      propertyCountCount[propertyKey].hasOrdinary || isOrdinary;

    const ratio = count / total;

    propertyCountCount[propertyKey].valueRatios.push({
      id: propertyValueKey,
      ratio,
    });

    return {
      id: propertyValueKey,
      propertyName,
      propertyValue,
      ratio,
      isOrdinary,
    };
  });

  Object.values(propertyCountCount).forEach((item) => {
    const { hasOrdinary, total, valueRankMap } = item;
    if (hasOrdinary) {
      // 存在平凡的值，则需要参考平均数
      item.ave = 1 / total;
    } else {
      // 否则参考信息量，将信息量排序，ratio 越小越重要
      item.valueRatios.sort((a, b) => a.ratio - b.ratio);
      item.valueRatios.forEach((valueRatio, i) => {
        const { id } = valueRatio;
        valueRankMap[id] = i;
      });
    }
  });

  properties.forEach((property) => {
    const { id, ratio } = property;
    const [itemType, propertyName] = id.split(SPLITTER);
    const propertyKey = `${itemType}${SPLITTER}${propertyName}`;
    const { hasOrdinary, ave, valueRankMap } = propertyCountCount[propertyKey];
    property.hasOrdinary = hasOrdinary;
    if (hasOrdinary) {
      if (ratio > ave && propertyName !== 'id') property.isOutlier = true;
    } else {
      property.rank = valueRankMap[id];
    }
  });

  return {
    nodes: properties,
    edges: propertyLinks,
  };
};
