import request from 'umi-request';
import { PROXY_HOST } from '../constant';

/* Login */
export async function login(params: { username: string; password: string }) {
  return request(`${PROXY_HOST}/login`, {
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
    credentials: 'include',
    withCredentials: true,
  });
}

/* Logout */
export async function logout(params: { Authorization: string }) {
  return request(`${PROXY_HOST}/logout`, {
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    params,
    credentials: 'include',
    withCredentials: true,
  });
}
