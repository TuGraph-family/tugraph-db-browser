import request from 'umi-request';
import { PROXY_HOST } from '../constant';
import { getLocalData } from '../utils/localStorage';
import { RoleProps } from '../interface/role';
/* GET role list */
export async function getRoleList() {
  return request(`${PROXY_HOST}/api/auth/role`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
  });
}
/* DELETE role */
export async function deleteRole(params: { role: string }) {
  return request(`${PROXY_HOST}/api/auth/role`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: { ...params },
  });
}

/* PUT role disabled */
export async function disabledRole(params: { role: string; disabled: boolean }) {
  return request(`${PROXY_HOST}/api/auth/role/disable`, {
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

/*POST add role */
export async function createRole(params: RoleProps) {
  return request(`${PROXY_HOST}/api/auth/role`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      role: params.role,
      description: params.description,
      permissions: params.permissions,
    },
  });
}

/*PUT edit role */
export async function editRole(params: RoleProps) {
  return request(`${PROXY_HOST}/api/auth/role`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      role: params.role,
      description: params.description,
      permissions: params.permissions,
    },
  });
}
