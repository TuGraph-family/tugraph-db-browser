import request from '../utils/request';
import { UserProps } from '../interface/user';

/* GET auth list */
// export async function getAuthList(params: { username?: string }) {
//   return request(
//     `/api/auth/user${params?.username ? '/' + params?.username : ''}`,
//     {
//       method: 'GET',
//       data: {},
//     }
//   );
// }

/*POST add user */
export async function createUser(params: UserProps) {
  return request(`/api/auth/user`, {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/*PUT edit user */
export async function editUser(params: UserProps) {
  return request(`/api/auth/user`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/* PUT user disabled */
// export async function disabledUser(params: {
//   username: string;
//   disabled: boolean;
// }) {
//   return request(`/api/auth/user/disable`, {
//     method: 'PUT',
//     data: {
//       ...params,
//     },
//   });
// }

/* DELETE user */
// export async function deleteUser(params: { username: string }) {
//   return request(`/api/auth/user`, {
//     method: 'DELETE',
//     data: {
//       ...params,
//     },
//   });
// }

/* PUT user password */
// export async function changePassword(params: {
//   curPassword: string;
//   password: string;
// }) {
//   return request(`/api/auth/password`, {
//     method: 'PUT',
//     data: {
//       ...params,
//     },
//   });
// }
