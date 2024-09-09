import { InitialState } from '@/app';

import { useRequest } from 'ahooks';
import { useModel } from 'umi';
import {
  getSchema,
  pathQuery,
  queryNeighbors,
  quickQuery,
  analysisCypherQuery,
} from '@/services/analysisi';


export const useAnalysis = () => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;

  /* 节点扩展 */
  const {
    runAsync: onQueryNeighbors,
    loading: onQueryNeighborsLoading,
    error: onQueryNeighborsError,
  } = useRequest(params => queryNeighbors(driver, params), {
    manual: true,
  });

  /* 配置查询 */
  const {
    runAsync: onQuickQuery,
    loading: onQuickQueryLoading,
    error: onQuickQueryError,
  } = useRequest(params => quickQuery(driver, params), {
    manual: true,
  });

  /* 路径查询 */
  const {
    runAsync: onPathQuery,
    loading: onPathQueryLoading,
    error: onPathQueryError,
  } = useRequest(params => pathQuery(driver, params), {
    manual: true,
  });

  /* 获取schema */
  const {
    runAsync: querySchema,
    loading: querySchemaLoading,
    error: querySchemaError,
  } = useRequest(params => getSchema(driver, params), {
    manual: true,
  });

  /* 语句查询 */
  const {
    runAsync: onAnalysisCypherQuery,
    loading: analysisCypherQueryLoading,
    error: analysisCypherQueryError,
  } = useRequest(params => analysisCypherQuery(driver, params), {
    manual: true,
  });

  return {
    onQuickQuery,
    onQuickQueryLoading,
    onQuickQueryError,
    onPathQuery,
    onPathQueryLoading,
    onPathQueryError,
    querySchema,
    querySchemaLoading,
    querySchemaError,
    onQueryNeighbors,
    onQueryNeighborsLoading,
    onQueryNeighborsError,
    onAnalysisCypherQuery,
    analysisCypherQueryLoading,
    analysisCypherQueryError,
  };
};
