import { useRequest } from 'ahooks';
import { createEdge, createNode, deleteEdge, deleteNode, updateEdge, updateNode } from '@/services/data';

export const useGraphData = () => {
  const {
    runAsync: onCreateEdge,
    loading: CreateEdgeLoading,
    error: CreateEdgeError,
  } = useRequest(createEdge, { manual: true });
  const {
    runAsync: onCreateNode,
    loading: CreateNodeLoading,
    error: CreateNodeError,
  } = useRequest(createNode, { manual: true });
  const {
    runAsync: onDeleteEdge,
    loading: DeleteEdgeLoading,
    error: DeleteEdgeError,
  } = useRequest(deleteEdge, { manual: true });
  const {
    runAsync: onDeleteNode,
    loading: DeleteNodeLoading,
    error: DeleteNodeError,
  } = useRequest(deleteNode, { manual: true });
  const {
    runAsync: onEditEdge,
    loading: EditEdgeLoading,
    error: EditEdgeError,
  } = useRequest(updateEdge, { manual: true });
  const {
    runAsync: onEditNode,
    loading: EditNodeLoading,
    error: EditNodeeError,
  } = useRequest(updateNode, { manual: true });

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
