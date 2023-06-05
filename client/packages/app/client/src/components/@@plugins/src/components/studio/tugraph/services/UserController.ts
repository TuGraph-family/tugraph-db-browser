import request from '../utils/request';

/* PUT user password */
export async function changePassword(params: {
  curPassword: string;
  password: string;
}) {
  return request(`/api/auth/password`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
