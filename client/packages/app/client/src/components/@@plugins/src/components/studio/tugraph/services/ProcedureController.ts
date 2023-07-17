import request from 'umi-request';
import { SERVER_HOST } from '../constant';
import {
  CallProcedure,
  DeleteProcedure,
  ProcedureCode,
  ProcedureParams,
  UploadProcedureParams,
} from '../interface/procedure';
import { getLocalData } from '../utils/localStorage';

/* Import Data */
export async function uploadProcedure(params: UploadProcedureParams) {
  return request(`${SERVER_HOST}/upload_procedure`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
/* 查询procedure */
export async function getProcedureList(params: ProcedureParams) {
  return request(`${SERVER_HOST}/list_procedures`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
/* 获取Procedure源代码 */
export async function getProcedureCode(params: ProcedureCode) {
  return request(`${SERVER_HOST}/get_procedure`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
/* 卸载存储过程 */
export async function deleteProcedure(params: DeleteProcedure) {
  return request(`${SERVER_HOST}/delete_procedure`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
/* 执行Procedure */
export async function callProcedure(params: CallProcedure) {
  return request(`${SERVER_HOST}/call_procedure`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
/* 获取procedure demo */
export async function getProcedureDemo(params: { type: string }) {
  return request(`${SERVER_HOST}/get_procedure_demo`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
