import { useRequest } from 'ahooks';
import { login, logout, refreshAuthToken } from '../services/AuthController';

export const useAuth = () => {
  const { runAsync: onLogin, loading: loginLoading, error: loginError } = useRequest(login, { manual: true });
  const {
    runAsync: onRefreshAuthToken,
    loading: refreshLoading,
    error: refreshError,
  } = useRequest(refreshAuthToken, {
    manual: true,
  });
  const { runAsync: onLogout, loading: logoutLoading, error: logoutError } = useRequest(logout, { manual: true });
  return {
    onLogin,
    loginLoading,
    loginError,
    onRefreshAuthToken,
    refreshLoading,
    refreshError,
    onLogout,
    logoutLoading,
    logoutError,
  };
};
