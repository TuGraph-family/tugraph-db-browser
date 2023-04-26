import { isEmpty, forEach, map, find, merge } from 'lodash';
import { IRoleRespons, IUserRespons } from '../service/tugraph/interface';

export const convertPermissions = (permissions: Record<string, string>) => {
  let result = `{`;
  const permissionList = Object.entries(permissions);
  forEach(permissionList, ([key, value], index) => {
    if (index === permissionList.length - 1) {
      result += `${key}: '${value}'}`;
    } else {
      result += `${key}: '${value}',`;
    }
  });
  return result;
};

export const userInfoTranslator = (
  userList: IUserRespons[],
  roleList: IRoleRespons[]
) => {
  if (isEmpty(userList)) {
    return [];
  }
  if (isEmpty(roleList)) {
    return userList;
  }
  return map(userList, (user: IUserRespons) => {
    if (isEmpty(user?.user_info?.roles)) {
      return user;
    }
    let permissions = {};

    forEach(user.user_info.roles, (roleName) => {
      const targetPermissions = find(
        roleList,
        (role: IRoleRespons) => role.role_name === roleName
      )?.role_info?.permissions;
      if (!isEmpty(targetPermissions)) {
        merge(permissions, targetPermissions);
      }
    });

    return {
      user_name: user.user_name,
      user_info: {
        permissions,
        ...user.user_info,
      },
    };
  });
};
