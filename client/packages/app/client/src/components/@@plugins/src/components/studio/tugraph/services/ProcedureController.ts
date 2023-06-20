import request from 'umi-request';
import { SERVER_HOST } from '../constant';
import { UploadProcedureParams } from '../interface/procedure';
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
