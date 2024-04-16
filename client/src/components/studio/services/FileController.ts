import request from 'umi-request';
import { PROXY_HOST } from '@/constants';
import { getLocalData } from '../utils/localStorage';
import { CheckFileParams, UploadFileParams } from '../interface/import';
import { EngineServerURL } from '../../../../../server/app/service/tugraph/constant';

/* Upload File */
export async function uploadFile(params: UploadFileParams, file: any) {
  return request(`${EngineServerURL}/upload_files`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
      'Content-Type': 'application/json',
      ...params,
    },
    body: file,
  });
}

/* Check File */
export async function checkFile(params: CheckFileParams) {
  return request(`${PROXY_HOST}/api/check_file`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
