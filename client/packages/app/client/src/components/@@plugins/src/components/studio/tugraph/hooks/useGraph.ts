import { useRequest } from 'ahooks';
import {
  createDemoGraph,
  createGraph,
  deleteGraph,
  editGraph,
  getGraphList,
  getNodeEdgeStatistics,
} from '../services/GraphController';

export const useGraph = () => {
  const {
    runAsync: onGetGraphList,
    loading: getGraphListLoading,
    error: getGraphListError,
  } = useRequest(getGraphList, { manual: true });

  const {
    runAsync: onCreateGraph,
    loading: createGraphLoading,
    error: createGraphError,
  } = useRequest(createGraph, { manual: true });
  const {
    runAsync: onDeleteGraph,
    loading: deleteGraphLoading,
    error: deleteGraphError,
  } = useRequest(deleteGraph, { manual: true });
  const {
    runAsync: onEditGraph,
    loading: editGraphLoading,
    error: editGraphError,
  } = useRequest(editGraph, { manual: true });
  const {
    runAsync: onGetNodeEdgeStatistics,
    loading: getNodeEdgeStatisticsLoading,
    error: getNodeEdgeStatisticsError,
  } = useRequest(getNodeEdgeStatistics, { manual: true });

  const {
    runAsync: onCreateDemoGraph,
    loading: CreateDemoGraphLoading,
    error: CreateDemoGraphError,
  } = useRequest(createDemoGraph, { manual: true });
  return {
    onGetGraphList,
    getGraphListLoading,
    getGraphListError,
    onCreateGraph,
    createGraphLoading,
    createGraphError,
    onDeleteGraph,
    deleteGraphLoading,
    deleteGraphError,
    onEditGraph,
    editGraphLoading,
    editGraphError,
    onGetNodeEdgeStatistics,
    getNodeEdgeStatisticsLoading,
    getNodeEdgeStatisticsError,
    onCreateDemoGraph,
    CreateDemoGraphLoading,
    CreateDemoGraphError,
  };
};
