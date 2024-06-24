import request from '../utils/request';
import { LabelSchema, LabelType, SchemaProperties } from '../interface/schema';
import { createSchema } from '@/services/schema';

/* Get Schema */
// export async function getGraphSchema(params: { graphName: string }) {
//   return request(`/api/schema/${params?.graphName}`, {
//     method: 'GET',
//   });
// }
/* 创建点边Schema */

export async function createLabelSchema(params: LabelSchema) {
  const param = {
    graphName: params?.graphName,
    labelType: params?.labelType,
    labelName: params?.labelName,
    properties: params?.properties,
    ...(params?.labelType === 'node'
      ? { primaryField: params?.primaryField, indexs: params?.indexs }
      : { edgeConstraints: params?.edgeConstraints }),
  };
  return createSchema(param);
}

/* 删除点边 */

// export async function deleteLabelSchema(params: {
//   labelType: LabelType;
//   labelName: string;
//   graphName: string;
// }) {
//   return request(`/api/schema/${params?.graphName}`, {
//     method: 'DELETE',
//     data: {
//       labelType: params?.labelType,
//       labelName: params?.labelName,
//     },
//   });
// }
/* 添加点边属性 */

// export async function createLabelPropertySchema(params: {
//   labelType: LabelType;
//   labelName: string;
//   graphName: string;
//   properties: Array<SchemaProperties>;
// }) {
//   return request(`/api/property/${params?.graphName}`, {
//     method: 'POST',
//     data: {
//       labelType: params?.labelType,
//       labelName: params?.labelName,
//       properties: params?.properties,
//     },
//   });
// }

/* 删除点边属性 */
// export async function deleteLabelPropertySchema(params: {
//   labelType: LabelType;
//   labelName: string;
//   graphName: string;
//   propertyNames: Array<string>;
// }) {
//   return request(`/api/property/${params?.graphName}`, {
//     method: 'DELETE',
//     data: {
//       labelType: params?.labelType,
//       labelName: params?.labelName,
//       propertyNames: params?.propertyNames,
//     },
//   });
// }

/* 修改点边属性 */

// export async function editLabelPropertySchema(params: {
//   labelType: LabelType;
//   labelName: string;
//   graphName: string;
//   properties: Array<SchemaProperties>;
// }) {
//   return request(`/api/property/${params?.graphName}`, {
//     method: 'PUT',
//     data: {
//       labelType: params?.labelType,
//       labelName: params?.labelName,
//       properties: params?.properties,
//     },
//   });
// }
/* 创建索引 */
// export async function createIndexSchema(params: {
//   propertyName: string;
//   labelName: string;
//   graphName: string;
//   isUnique: boolean;
// }) {
//   return request(`/api/index/${params?.graphName}`, {
//     method: 'POST',
//     data: {
//       propertyName: params?.propertyName,
//       labelName: params?.labelName,
//       isUnique: params?.isUnique,
//     },
//   });
// }
/* 删除索引 */
// export async function deleteIndexSchema(params: {
//   propertyName: string;
//   labelName: string;
//   graphName: string;
// }) {
//   return request(`/api/index/${params?.graphName}`, {
//     method: 'DELETE',
//     data: {
//       propertyName: params?.propertyName,
//       labelName: params?.labelName,
//     },
//   });
// }
