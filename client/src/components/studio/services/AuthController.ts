import request from 'umi-request';
import { getLocalData } from '../utils';
import { PROXY_HOST } from '@/constants';

/* Login */
export async function login(params: { userName: string; password: string }) {
  return request(`${PROXY_HOST}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      ...params,
    },
  });
}

/* Refresh Token */
export async function refreshAuthToken(params: { Authorization: string }) {
  return request(`${PROXY_HOST}/api/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
  });
}

/* Logout */
export async function logout() {
  return request(`${PROXY_HOST}/api/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
  });
}
