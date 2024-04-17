import { PROXY_HOST } from '@/constants';
import request from 'umi-request';
import { CheckFileParams, UploadFileParams } from '../interface/import';
import { getLocalData } from '../utils/localStorage';

/* Upload File */
export async function uploadFile(params: UploadFileParams, file: File) {
  const formData = new FormData();
  formData.append('file', file);
  return request(`${PROXY_HOST}/api/upload_files`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
      ...params,
    },
    data: formData,
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
