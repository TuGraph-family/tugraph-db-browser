import { useRequest } from 'ahooks';
import {
  getProcedureDemo,
} from '../services/ProcedureController';

import {
  buildProcedure,
  getProcedureList,
  executeProcedure,
  getProcedureCode,
  deleteProcedure
} from '@/services/procedure';

export const useProcedure = () => {
  const {
    runAsync: onUploadProcedure,
    loading: UploadProcedureLoading,
    error: UploadProcedureError,
  } = useRequest(buildProcedure, { manual: true });
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
  } = useRequest(executeProcedure, { manual: true });

  const {
    runAsync: onGetProcedureDemo,
    loading: GetProcedureDemoLoading,
    error: GetProcedureDemoError,
  } = useRequest(getProcedureDemo, { manual: true });

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
    onGetProcedureDemo,
    GetProcedureDemoLoading,
    GetProcedureDemoError,
  };
};
