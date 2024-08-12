import { useRequest } from 'ahooks';
import {
  createEdge,
  createNode,
  deleteEdge,
  deleteNode,
  updateEdge,
  updateNode,
} from '@/services/data';
import { useModel } from 'umi';
import { InitialState } from '@/app';

export const useGraphData = () => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;
  const {
    runAsync: onCreateEdge,
    loading: CreateEdgeLoading,
    error: CreateEdgeError,
  } = useRequest(params => createEdge(driver, params), { manual: true });
  const {
    runAsync: onCreateNode,
    loading: CreateNodeLoading,
    error: CreateNodeError,
  } = useRequest(params => createNode(driver, params), { manual: true });
  const {
    runAsync: onDeleteEdge,
    loading: DeleteEdgeLoading,
    error: DeleteEdgeError,
  } = useRequest(params => deleteEdge(driver, params), { manual: true });
  const {
    runAsync: onDeleteNode,
    loading: DeleteNodeLoading,
    error: DeleteNodeError,
  } = useRequest(params => deleteNode(driver, params), { manual: true });
  const {
    runAsync: onEditEdge,
    loading: EditEdgeLoading,
    error: EditEdgeError,
  } = useRequest(params => updateEdge(driver, params), { manual: true });
  const {
    runAsync: onEditNode,
    loading: EditNodeLoading,
    error: EditNodeeError,
  } = useRequest(params => updateNode(driver, params), { manual: true });

  return {
    onCreateEdge,
    CreateEdgeLoading,
    CreateEdgeError,
    onCreateNode,
    CreateNodeLoading,
    CreateNodeError,
    onDeleteEdge,
    DeleteEdgeLoading,
    DeleteEdgeError,
    onDeleteNode,
    DeleteNodeLoading,
    DeleteNodeError,
    onEditEdge,
    EditEdgeLoading,
    EditEdgeError,
    onEditNode,
    EditNodeLoading,
    EditNodeeError,
  };
};
