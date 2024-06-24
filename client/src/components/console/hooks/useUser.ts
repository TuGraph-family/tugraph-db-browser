import {
  deleteUser,
  updatePassword,
  disabledUser,
} from '@/queries/security';
import { useRequest } from 'ahooks';
import { useModel } from 'umi';
import { InitialState } from '@/app';
import { queryCreateUser, queryUsers, updateUser } from '../utils/query';

export const useUser = () => {
  const { initialState } = useModel('@@initialState');
  const { session } = initialState as InitialState;

  const {
    runAsync: onGetAuthList,
    loading: GetAuthListLoading,
    error: GetAuthListError,
  } = useRequest(queryUsers, { manual: true });

  const {
    runAsync: onCreateUser,
    loading: CreateUserLoading,
    error: CreateUserError,
  } = useRequest(queryCreateUser, { manual: true });

  const {
    runAsync: onEditUser,
    loading: EditUserLoading,
    error: EditUserError,
  } = useRequest(updateUser, { manual: true });

  const {
    runAsync: onDisabledUser,
    loading: DisabledUserLoading,
    error: DisabledUserError,
  } = useRequest(params => session.run(disabledUser(params)), { manual: true });

  const {
    runAsync: onDeleteUser,
    loading: DeleteUserLoading,
    error: DeleteUserError,
  } = useRequest(params => session.run(deleteUser(params.username)), {
    manual: true,
  });

  const {
    runAsync: onChangePassword,
    loading: ChangePasswordLoading,
    error: ChangePasswordError,
  } = useRequest(params => session.run(updatePassword(params)), {
    manual: true,
  });

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
