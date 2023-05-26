import request from 'umi-request';
import { PROXY_HOST } from '../constant';
import { LabelSchema, LabelType, SchemaProperties } from '../interface/schema';
import { getLocalData } from '../utils/localStorage';

/* Get Schema */
export async function getGraphSchema(params: { graphName: string }) {
  return request(`${PROXY_HOST}/api/schema/${params?.graphName}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
  });
}
/* 创建点边Schema */

export async function createLabelSchema(params: LabelSchema) {
  return request(`${PROXY_HOST}/api/schema/${params?.graphName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      labelType: params?.labelType,
      labelName: params?.labelName,
      properties: params?.properties,
      ...(params?.labelType === 'node'
        ? { primaryField: params?.primaryField, indexs: params?.indexs }
        : { edgeConstraints: params?.edgeConstraints }),
    },
  });
}

/* 删除点边 */

export async function deleteLabelSchema(params: { labelType: LabelType; labelName: string; graphName: string }) {
  return request(`${PROXY_HOST}/api/schema/${params?.graphName}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      labelType: params?.labelType,
      labelName: params?.labelName,
    },
  });
}
/* 添加点边属性 */

export async function createLabelPropertySchema(params: {
  labelType: LabelType;
  labelName: string;
  graphName: string;
  properties: Array<SchemaProperties>;
}) {
  return request(`${PROXY_HOST}/api/property/${params?.graphName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      labelType: params?.labelType,
      labelName: params?.labelName,
      properties: params?.properties,
    },
  });
}

/* 删除点边属性 */
export async function deleteLabelPropertySchema(params: {
  labelType: LabelType;
  labelName: string;
  graphName: string;
  propertyNames: Array<string>;
}) {
  return request(`${PROXY_HOST}/api/property/${params?.graphName}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      labelType: params?.labelType,
      labelName: params?.labelName,
      propertyNames: params?.propertyNames,
    },
  });
}

/* 修改点边属性 */

export async function editLabelPropertySchema(params: {
  labelType: LabelType;
  labelName: string;
  graphName: string;
  properties: Array<SchemaProperties>;
}) {
  return request(`${PROXY_HOST}/api/property/${params?.graphName}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      labelType: params?.labelType,
      labelName: params?.labelName,
      properties: params?.properties,
    },
  });
}
/* 创建索引 */
export async function createIndexSchema(params: {
  propertyName: string;
  labelName: string;
  graphName: string;
  isUnique: boolean;
}) {
  return request(`${PROXY_HOST}/api/index/${params?.graphName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      propertyName: params?.propertyName,
      labelName: params?.labelName,
      isUnique: params?.isUnique,
    },
  });
}
/* 删除索引 */
export async function deleteIndexSchema(params: { propertyName: string; labelName: string; graphName: string }) {
  return request(`${PROXY_HOST}/api/index/${params?.graphName}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    withCredentials: true,
    credentials: 'include',
    data: {
      propertyName: params?.propertyName,
      labelName: params?.labelName,
    },
  });
}
