import request from '../utils/request';
import { FileSchema, Schema } from '../interface/import';

/* Get Graph list */
// export async function getGraphList(params: { userName: string }) {
//   return request(`/api/subgraph?userName=${params?.userName}`, {
//     method: 'GET',
//     data: {},
//   });
// }
/* POST Create Graph*/
// export async function createGraph(params: {
//   graphName: string;
//   config: { maxSizeGB: number; description: string };
// }) {
//   return request(`/api/subgraph`, {
//     method: 'POST',
//     data: {
//       ...params,
//     },
//   });
// }

/* DELETE Graph*/
// export async function deleteGraph(params: { graphName: string }) {
//   return request(`/api/subgraph`, {
//     method: 'DELETE',
//     data: { ...params },
//   });
// }

/* EDIT Graph*/
// export async function editGraph(params: {
//   graphName: string;
//   config: { maxSizeGB: number; description: string };
// }) {
//   return request(`/api/subgraph`, {
//     method: 'PUT',
//     data: {
//       ...params,
//     },
//   });
// }

// export async function getNodeEdgeStatistics(graphName: string) {
//   return request(`/api/statistics/${graphName}`, {
//     method: 'GET',
//   });
// }

/* POST Create Demo Graph*/
export async function createDemoGraph(params: {
  graphName: string;
  config: { maxSizeGB: number; description: string };
  description: { schema: Schema[]; files: FileSchema[] };
}) {
  return request(`/api/subgraph/template`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
