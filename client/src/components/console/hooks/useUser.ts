import { deleteUser, updatePassword, disabledUser } from '@/queries/security';
import { useRequest } from 'ahooks';
import { useModel } from 'umi';
import { InitialState } from '@/app';
import { queryCreateUser, queryUsers, updateUser } from '../utils/query';
import { request } from '@/services/request';

export const useUser = () => {
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;
  const {
    runAsync: onGetAuthList,
    loading: GetAuthListLoading,
    error: GetAuthListError,
  } = useRequest(params => queryUsers(driver, params), { manual: true });

  const {
    runAsync: onCreateUser,
    loading: CreateUserLoading,
    error: CreateUserError,
  } = useRequest(params => queryCreateUser(driver, params), { manual: true });

  const {
    runAsync: onEditUser,
    loading: EditUserLoading,
    error: EditUserError,
  } = useRequest(params => updateUser(driver, params), { manual: true });

  const {
    runAsync: onDisabledUser,
    loading: DisabledUserLoading,
    error: DisabledUserError,
  } = useRequest(params => request({ driver, cypher: disabledUser(params) }), {
    manual: true,
  });

  const {
    runAsync: onDeleteUser,
    loading: DeleteUserLoading,
    error: DeleteUserError,
  } = useRequest(
    params => request({ driver, cypher: deleteUser(params.username) }),
    {
      manual: true,
    },
  );

  const {
    runAsync: onChangePassword,
    loading: ChangePasswordLoading,
    error: ChangePasswordError,
  } = useRequest(
    params => request({ driver, cypher: updatePassword(params) }),
    {
      manual: true,
    },
  );

  return {
    onGetAuthList,
    GetAuthListLoading,
    GetAuthListError,
    onCreateUser,
    CreateUserLoading,
    CreateUserError,
    onEditUser,
    EditUserLoading,
    EditUserError,
    onDisabledUser,
    DisabledUserLoading,
    DisabledUserError,
    onDeleteUser,
    DeleteUserLoading,
    DeleteUserError,
    onChangePassword,
    ChangePasswordLoading,
    ChangePasswordError,
  };
};
