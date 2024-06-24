import { useRequest } from 'ahooks';
import { queryByGraphLanguage, queryByNode, queryByPath } from '@/services/query';

export const useQuery = () => {
  const {
    runAsync: onStatementQuery,
    loading: StatementQueryLoading,
    error: StatementQueryError,
  } = useRequest(queryByGraphLanguage, { manual: true });
  const {
    runAsync: onNodeQuery,
    loading: NodeQueryLoading,
    error: NodeQueryError,
  } = useRequest(queryByNode, { manual: true });
  const {
    runAsync: onPathQuery,
    loading: PathQueryLoading,
    error: PathQueryError,
  } = useRequest(queryByPath, { manual: true });

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
