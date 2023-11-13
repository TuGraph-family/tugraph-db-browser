import {
  getAuthList,
  createUser,
  editUser,
  disabledUser,
  deleteUser,
  changePassword,
} from '../services/UserController';
import { useRequest } from 'ahooks';
export const useUser = () => {
  const {
    runAsync: onGetAuthList,
    loading: GetAuthListLoading,
    error: GetAuthListError,
  } = useRequest(getAuthList, { manual: true });

  const {
    runAsync: onCreateUser,
    loading: CreateUserLoading,
    error: CreateUserError,
  } = useRequest(createUser, { manual: true });

  const {
    runAsync: onEditUser,
    loading: EditUserLoading,
    error: EditUserError,
  } = useRequest(editUser, { manual: true });

  const {
    runAsync: onDisabledUser,
    loading: DisabledUserLoading,
    error: DisabledUserError,
  } = useRequest(disabledUser, { manual: true });

  const {
    runAsync: onDeleteUser,
    loading: DeleteUserLoading,
    error: DeleteUserError,
  } = useRequest(deleteUser, { manual: true });

  const {
    runAsync: onChangePassword,
    loading: ChangePasswordLoading,
    error: ChangePasswordError,
  } = useRequest(changePassword, { manual: true });

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
