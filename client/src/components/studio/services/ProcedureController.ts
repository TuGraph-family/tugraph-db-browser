import request from 'umi-request';

import { PROXY_HOST } from '@/constants';
import { getLocalData } from '../utils/localStorage';




/* 获取procedure demo */
export async function getProcedureDemo(params: { type: string }) {
  return request(`${PROXY_HOST}/api/get_procedure_demo`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}
