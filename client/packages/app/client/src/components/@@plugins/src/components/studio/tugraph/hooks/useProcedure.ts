import { useRequest } from 'ahooks';
import { uploadProcedure } from '../services/ProcedureController';
export const useProcedure = () => {
  const {
    runAsync: onUploadProcedure,
    loading: UploadProcedureLoading,
    error: UploadProcedureError,
  } = useRequest(uploadProcedure, { manual: true });
  return {
    onUploadProcedure,
    UploadProcedureLoading,
    UploadProcedureError,
  };
};
