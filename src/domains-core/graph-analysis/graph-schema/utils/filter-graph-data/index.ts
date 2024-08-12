import { StatisticsFilterCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { GraphData } from '@antv/g6';
/**
 *
 * @param source 筛选前的画布数据
 * @param filterCriteria 筛选标准
 * @param graph G6 画布实例
 * @returns
 */
export const filterGraphData = (
  source: GraphData,
  filterCriteria: StatisticsFilterCondition,
  isFilterIsolatedNodes: boolean,
): GraphData => {
  const { analyzerType, isFilterReady, elementType, prop, selectValue, range } =
    filterCriteria;
  if (!isFilterReady || analyzerType === 'NONE') {
    return source;
  }

  const newData: GraphData = {
    nodes: [],
    edges: [],
  };

  if (elementType === 'node') {
    const inValidNodes = new Set<string>();
    newData.nodes = source.nodes?.filter((node) => {
      if (
        analyzerType === 'SELECT' ||
        analyzerType === 'PIE' ||
        analyzerType === 'WORDCLOUD' ||
        analyzerType === 'COLUMN'
      ) {
        if (
          node.properties &&
          node.properties[prop!] !== undefined &&
          selectValue?.indexOf(node.properties[prop!] as string) !== -1
        ) {
          return true;
        }
        inValidNodes.add(node.id);
        return false;
      } else if (analyzerType === 'HISTOGRAM') {
        for (let arr of range!) {
          const min = arr[0];
          const max = arr[1];
          if (
            node.properties &&
            node.properties[prop!] &&
            min <= node.properties[prop!] &&
            node.properties[prop!] <= max
          ) {
            return true;
          }
        }
        inValidNodes.add(node.id);
        return false;
      }
      return false;
    });
    newData.edges = source.edges?.filter((edge) => {
      return !inValidNodes.has(edge.source) && !inValidNodes.has(edge.target);
    });
  } else if (elementType === 'edge') {
    const validNodes = new Set<string>();
    newData.edges = source.edges?.filter((edge) => {
      if (
        analyzerType === 'SELECT' ||
        analyzerType === 'PIE' ||
        analyzerType === 'WORDCLOUD' ||
        analyzerType === 'COLUMN'
      ) {
        if (
          edge.properties &&
          edge.properties[prop!] !== undefined &&
          selectValue?.indexOf(edge.properties[prop!]) !== -1
        ) {
          validNodes.add(edge.source);
          validNodes.add(edge.target);
          return true;
        }

        return false;
      } else if (analyzerType === 'HISTOGRAM') {
        for (let arr of range!) {
          const min = arr![0];
          const max = arr![1];
          if (
            edge.properties &&
            edge.properties[prop!] &&
            min <= edge.properties[prop!] &&
            edge.properties[prop!] <= max
          ) {
            validNodes.add(edge.source);
            validNodes.add(edge.target);
            return true;
          }
        }
        return false;
      }
      return false;
    });
    newData.nodes = isFilterIsolatedNodes
      ? source.nodes?.filter((node) => validNodes.has(node.id))
      : source.nodes;
  }
  return newData;
};
