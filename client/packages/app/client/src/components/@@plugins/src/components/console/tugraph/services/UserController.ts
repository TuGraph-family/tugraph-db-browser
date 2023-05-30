import request from 'umi-request';
import { PROXY_HOST } from '../constant';
import { UserProps } from '../interface/user';
import { getLocalData } from '../utils/localStorage';

/* GET auth list */
export async function getAuthList(params: { username?: string }) {
  return request(`${PROXY_HOST}/api/auth/user${params?.username ? '/' + params?.username : ''}`, {
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

/*POST add user */
export async function createUser(params: UserProps) {
  return request(`${PROXY_HOST}/api/auth/user`, {
    method: 'POST',
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

/*PUT edit user */
export async function editUser(params: UserProps) {
  return request(`${PROXY_HOST}/api/auth/user`, {
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

/* PUT user disabled */
export async function disabledUser(params: { username: string; disabled: boolean }) {
  return request(`${PROXY_HOST}/api/auth/user/disable`, {
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

/* DELETE user */
export async function deleteUser(params: { username: string }) {
  return request(`${PROXY_HOST}/api/auth/user`, {
    method: 'DELETE',
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
