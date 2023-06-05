import React from 'react';
import { PROXY_HOST } from '../constant';
import { extend } from 'umi-request';
import { message } from 'antd';
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
  if (data.errorCode === 401) {
    message.warning('登录过期，请重新登录');
    window.location.href = '/admin/ks0v7y637ix';
  }
  return response;
});

export default request;
