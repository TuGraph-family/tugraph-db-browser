import request from '../utils/request';
import { RoleProps } from '../interface/role';
/* GET role list */
export async function getRoleList() {
  return request(`/api/auth/role`, {
    method: 'GET',
  });
}
/* DELETE role */
// export async function deleteRole(params: { role: string }) {
//   return request(`/api/auth/role`, {
//     method: 'DELETE',
//     data: { ...params },
//   });
// }

/* PUT role disabled */
// export async function disabledRole(params: {
//   role: string;
//   disabled: boolean;
// }) {
//   return request(`/api/auth/role/disable`, {
//     method: 'PUT',

//     data: {
//       ...params,
//     },
//   });
// }

/*POST add role */
export async function createRole(params: RoleProps) {
  return request(`/api/auth/role`, {
    method: 'POST',
    data: {
      role: params.role,
      description: params.description,
      permissions: params.permissions,
    },
  });
}

/*PUT edit role */
export async function editRole(params: RoleProps) {
  return request(`/api/auth/role`, {
    method: 'PUT',
    data: {
      role: params.role,
      description: params.description,
      permissions: params.permissions,
    },
  });
}
