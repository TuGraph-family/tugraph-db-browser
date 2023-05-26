import request from 'umi-request';
import { PROXY_HOST } from '../constant';
import { getLocalData } from '../utils/localStorage';

/* Get Graph list */
export async function getGraphList(params: { userName: string }) {
  return request(`${PROXY_HOST}/api/subgraph?userName=${params?.userName}`, {
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
/* POST Create Graph*/
export async function createGraph(params: { graphName: string; config: { maxSizeGB: number; description: string } }) {
  return request(`${PROXY_HOST}/api/subgraph`, {
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

/* DELETE Graph*/
export async function deleteGraph(params: { graphName: string }) {
  return request(`${PROXY_HOST}/api/subgraph`, {
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

/* EDIT Graph*/
export async function editGraph(params: { graphName: string; config: { maxSizeGB: number; description: string } }) {
  return request(`${PROXY_HOST}/api/subgraph`, {
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

export async function getNodeEdgeStatistics(graphName: string) {
  return request(`${PROXY_HOST}/api/statistics/${graphName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
  });
}
