import { InitialState } from '@/app';
import {
  createGraph,
  getGraphList,
  editGraph,
  deleteGraph,
} from '@/queries/graph';
import { useRequest } from 'ahooks';
import { useModel } from 'umi';
import { createSubGraphFromTemplate } from '@/components/console/utils/query';
import { getNodeEdgeStatistics } from '@/services/schema';
import { request } from '@/services/request';

export const useGraph = () => {
  const { initialState } = useModel('@@initialState');
  const { driver, userInfo } = initialState as InitialState;
  const {
    runAsync: onGetGraphList,
    loading: getGraphListLoading,
    error: getGraphListError,
  } = useRequest(
    () =>
      request({
        driver,
        cypher: getGraphList({ userName: userInfo.userName }),
      }),
    {
      manual: true,
    },
  );

  const {
    runAsync: onCreateGraph,
    loading: createGraphLoading,
    error: createGraphError,
  } = useRequest(params => request({ driver, cypher: createGraph(params) }), {
    manual: true,
  });
  const {
    runAsync: onDeleteGraph,
    loading: deleteGraphLoading,
    error: deleteGraphError,
  } = useRequest(params => request({ driver, cypher: deleteGraph(params) }), {
    manual: true,
  });
  const {
    runAsync: onEditGraph,
    loading: editGraphLoading,
    error: editGraphError,
  } = useRequest(params => request({ driver, cypher: editGraph(params) }), {
    manual: true,
  });
  const {
    runAsync: onGetNodeEdgeStatistics,
    loading: getNodeEdgeStatisticsLoading,
    error: getNodeEdgeStatisticsError,
  } = useRequest(params => getNodeEdgeStatistics(driver, params), {
    manual: true,
  });

  const {
    runAsync: onCreateDemoGraph,
    loading: CreateDemoGraphLoading,
    error: CreateDemoGraphError,
  } = useRequest(params => createSubGraphFromTemplate(driver, params), {
    manual: true,
  });

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
