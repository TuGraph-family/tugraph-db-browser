import request from 'umi-request';
import { PROXY_HOST, SERVER_HOST } from '../constant';
import { getLocalData } from '../utils';

/* Login */
export async function login(params: { userName: string; password: string }) {
  return request(`${SERVER_HOST}/login`, {
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
  return request(`${PROXY_HOST}/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params,
  });
}

/* Logout */
export async function logout() {
  return request(`${SERVER_HOST}/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
  });
}
