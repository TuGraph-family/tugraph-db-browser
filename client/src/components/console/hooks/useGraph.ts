
import { useRequest } from "ahooks";
import { useModel } from 'umi';
import { InitialState } from '@/app';
import { getGraphList,createGraph,editGraph,  deleteGraph, } from "@/queries/graph";
import { getNodeEdgeStatistics } from "@/services/schema";

export const useGraph = () => {
  const { initialState } = useModel('@@initialState');
  const { session, userInfo } = initialState as InitialState;
  const {
    runAsync: onGetGraphList,
    loading: getGraphListLoading,
    error: getGraphListError,
  } = useRequest(() => session.run(getGraphList({ userName: userInfo.userName })), { manual: true });

  const {
    runAsync: onCreateGraph,
    loading: createGraphLoading,
    error: createGraphError,
  } = useRequest((params)=>session.run(createGraph(params)), { manual: true });
  const {
    runAsync: onDeleteGraph,
    loading: deleteGraphLoading,
    error: deleteGraphError,
  } = useRequest((params)=>session.run(deleteGraph(params)), { manual: true });
  const {
    runAsync: onEditGraph,
    loading: editGraphLoading,
    error: editGraphError,
  } = useRequest((params)=>session.run(editGraph(params)), { manual: true });
  const {
    runAsync: onGetNodeEdgeStatistics,
    loading: getNodeEdgeStatisticsLoading,
    error: getNodeEdgeStatisticsError,
  } = useRequest(getNodeEdgeStatistics, { manual: true });
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
  };
};
