import request from 'umi-request';
import { PROXY_HOST } from '../constant';
import { getLocalData } from '../utils/localStorage';

/* Get System Info */
export async function getSystemInfo() {
  return request(`${PROXY_HOST}/api/info/system`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {},
  });
}

/* Get Database Info */
export async function getDatabaseInfo() {
  return request(`${PROXY_HOST}/api/info/database`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {},
  });
}
