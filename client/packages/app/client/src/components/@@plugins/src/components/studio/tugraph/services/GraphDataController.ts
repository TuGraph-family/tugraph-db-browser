import request from 'umi-request';
import { PROXY_HOST } from '../constant';
import { getLocalData } from '../utils/localStorage';

/* Create Node*/
export async function createNode(params: CreateNode) {
  return request(`${PROXY_HOST}/api/data/node`, {
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

/* Create Edge*/
export async function createEdge(params: CreateEdge) {
  return request(`${PROXY_HOST}/api/data/edge`, {
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

/* Edit Node*/
export async function editNode(params: EditNode) {
  return request(`${PROXY_HOST}/api/data/node`, {
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

/* Edit Edge*/
export async function editEdge(params: EditEdge) {
  return request(`${PROXY_HOST}/api/data/edge`, {
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

/* Delete Node*/
export async function deleteNode(params: DeleteNode) {
  return request(`${PROXY_HOST}/api/data/node`, {
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

/* Delete Edge*/
export async function deleteEdge(params: DeleteEdge) {
  return request(`${PROXY_HOST}/api/data/edge`, {
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
