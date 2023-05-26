import request from 'umi-request';
import { PROXY_HOST } from '../constant';
import { NodeQueryParams, PathQueryParams, StatementParams } from '../interface/query';
import { getLocalData } from '../utils/localStorage';
/* 语句查询接口 */
export async function statementQuery(params: StatementParams) {
  return request(`${PROXY_HOST}/api/query/language`, {
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

/* 节点查询接口 */
export async function nodeQuery(params: NodeQueryParams) {
  return request(`${PROXY_HOST}/api/query/node`, {
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

/* 路径查询接口 */
export async function pathQuery(params: PathQueryParams) {
  return request(`${PROXY_HOST}/api/query/path`, {
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
