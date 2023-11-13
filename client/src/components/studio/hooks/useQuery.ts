import { useRequest } from 'ahooks';
import { nodeQuery, pathQuery, statementQuery } from '../services/QueryController';

export const useQuery = () => {
  const {
    runAsync: onStatementQuery,
    loading: StatementQueryLoading,
    error: StatementQueryError,
  } = useRequest(statementQuery, { manual: true });
  const {
    runAsync: onNodeQuery,
    loading: NodeQueryLoading,
    error: NodeQueryError,
  } = useRequest(nodeQuery, { manual: true });
  const {
    runAsync: onPathQuery,
    loading: PathQueryLoading,
    error: PathQueryError,
  } = useRequest(pathQuery, { manual: true });

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
