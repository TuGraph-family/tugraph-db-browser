import { useRequest } from 'ahooks';
import { changePassword } from '../services/UserController';
export const useUser = () => {
  const {
    runAsync: onChangePassword,
    loading: ChangePasswordLoading,
    error: ChangePasswordError,
  } = useRequest(changePassword, { manual: true });

  return {
    onChangePassword,
    ChangePasswordLoading,
    ChangePasswordError,
  };
};
