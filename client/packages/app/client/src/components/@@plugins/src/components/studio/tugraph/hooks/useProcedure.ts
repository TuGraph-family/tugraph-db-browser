import { useRequest } from 'ahooks';
import {
  callProcedure,
  deleteProcedure,
  getProcedureCode,
  getProcedureList,
  uploadProcedure,
} from '../services/ProcedureController';
export const useProcedure = () => {
  const {
    runAsync: onUploadProcedure,
    loading: UploadProcedureLoading,
    error: UploadProcedureError,
  } = useRequest(uploadProcedure, { manual: true });
  const {
    runAsync: onGetProcedureCode,
    loading: GetProcedureCodeLoading,
    error: GetProcedureCodeError,
  } = useRequest(getProcedureCode, { manual: true });
  const {
    runAsync: onGetProcedureList,
    loading: GetProcedureListLoading,
    error: GetProcedureListError,
  } = useRequest(getProcedureList, { manual: true });
  const {
    runAsync: onDeleteProcedure,
    loading: DeleteProcedureLoading,
    error: DeleteProcedureError,
  } = useRequest(deleteProcedure, { manual: true });
  const {
    runAsync: onCallProcedure,
    loading: CallProcedureLoading,
    error: CallProcedureError,
  } = useRequest(callProcedure, { manual: true });

  return {
    onUploadProcedure,
    UploadProcedureLoading,
    UploadProcedureError,
    onGetProcedureCode,
    GetProcedureCodeLoading,
    GetProcedureCodeError,
    onGetProcedureList,
    GetProcedureListLoading,
    GetProcedureListError,
    onDeleteProcedure,
    DeleteProcedureLoading,
    DeleteProcedureError,
    onCallProcedure,
    CallProcedureLoading,
    CallProcedureError,
  };
};
