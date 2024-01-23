import { message } from 'antd';
import { extend } from 'umi-request';
import { PROXY_HOST } from '../constant';
import { getLocalData } from './localStorage';

export const HOLD_TIME = 2.5;

const request = extend({
  headers: {
    'Content-Type': 'application/json',
    Authorization: getLocalData('TUGRAPH_TOKEN'),
  },
  prefix: PROXY_HOST,
  withCredentials: true,
  credentials: 'include',
  // 默认错误处理
  crossOrigin: true, // 开启CORS跨域
});
// 中间件
request.interceptors.response.use(async response => {
  const data = await response.clone().json();
  const TUGRAPH_TOKEN = getLocalData('TUGRAPH_TOKEN');
  if ((!TUGRAPH_TOKEN && data.errorCode == 400) || data.errorCode == 401) {
    new Promise<void>(resolve => {
      setTimeout(() => {
        message.warning('登录过期，请重新登录', HOLD_TIME);
        resolve();
      }, 2500);
    }).then(() => {
      // 清除掉之前的缓存
      localStorage.removeItem('TUGRAPH_TOKEN');
      window.location.href = '/login';
    });
  }
  if (data.errorCode == 500) {
    message.error('请求失败' + data.errorMessage, HOLD_TIME);
  }
  return response;
});

export default request;
