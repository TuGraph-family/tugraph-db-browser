import request from 'umi-request';
import { SERVER_HOST } from '../constant';
import { getLocalData } from '../utils/localStorage';
import { CheckFileParams, UploadFileParams } from '../interface/import';

/* Upload File */
export async function uploadFile(params: UploadFileParams, file: any) {
  return request(`${SERVER_HOST}/upload_files`, {
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
  return request(`${SERVER_HOST}/check_file`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
