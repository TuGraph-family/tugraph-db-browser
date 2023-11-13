import { message } from 'antd';
import { extend } from 'umi-request';
import { PROXY_HOST } from '../constant';
import { getLocalData } from './localStorage';

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
request.interceptors.response.use(async (response) => {
  const data = await response.clone().json();
  if (data.errorCode == 401 || data.errorCode == 400) {
    message.warning('登录过期，请重新登录');
    // 清除掉之前的缓存
    localStorage.removeItem('TUGRAPH_TOKEN')
    window.location.href = '/login';
  }
  if (data.errorCode == 500) {
    message.error('请求失败' + data.errorMessage);
  }
  return response;
});

export default request;
