import request from 'umi-request';
import { PROXY_HOST } from '../constant';
import { getLocalData } from '../utils/localStorage';

/* PUT user password */
export async function changePassword(params: { curPassword: string; password: string }) {
  return request(`${PROXY_HOST}/api/auth/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      ...params,
    },
  });
}
