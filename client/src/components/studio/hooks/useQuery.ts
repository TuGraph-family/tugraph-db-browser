import { useRequest } from 'ahooks';
import { queryByGraphLanguage, queryByNode, queryByPath } from '@/services/query';
import { useModel } from 'umi';
import { InitialState } from '@/app';

export const useQuery = () => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;
  
  const {
    runAsync: onStatementQuery,
    loading: StatementQueryLoading,
    error: StatementQueryError,
  } = useRequest(params=>queryByGraphLanguage(driver,params), { manual: true });

  const {
    runAsync: onNodeQuery,
    loading: NodeQueryLoading,
    error: NodeQueryError,
  } = useRequest(params=>queryByNode(driver,params), { manual: true });

  const {
    runAsync: onPathQuery,
    loading: PathQueryLoading,
    error: PathQueryError,
  } = useRequest(params=>queryByPath(driver,params), { manual: true });

  return {
    onStatementQuery,
    StatementQueryLoading,
    StatementQueryError,
    onNodeQuery,
    NodeQueryLoading,
    NodeQueryError,
    onPathQuery,
    PathQueryLoading,
    PathQueryError,
  };
};
