import { RestFulResponse } from '@/types/services';
import { QueryResultFormatter } from '@/utils/schema';
import { formatCypherResult } from '..';
import { filter, map } from 'lodash';

/* 图分析 数据转换 */
export const graphDataTranslator = (
  result: RestFulResponse,
  script: string,
) => {
  const {
    data: { formatData = [], originalData = [] },
  } = QueryResultFormatter(result, script) || {};

  const newFormatData = formatCypherResult(formatData);

  const { nodes, edges } = newFormatData;
  const nodeIdList = map(nodes, item => item.id);
  /* 过滤掉缺失数据的边 */
  const filteredEdges = filter(
    edges,
    item =>
      nodeIdList.includes(item.source) && nodeIdList.includes(item.target),
  );

  return {
    formatData: { nodes, edges: filteredEdges },
    originalData,
  };
};
