export const APP_ENTRY = 'TU_GRAPH';
export const APP_LINKS = [
  {
    title: '图项目',
    key: APP_ENTRY + '_STUDIO',
    path: '/home',
  },
  {
    title: '控制台',
    key: APP_ENTRY + '_CONSOLE',
    path: '/console',
  },
];

export const CONSOLE_LINKS = [
  {
    title: '账户管理',
    key: APP_ENTRY + '_AUTH',
    path: '/auth',
  },
  {
    title: '数据库信息',
    key: APP_ENTRY + '_DATABASE',
    path: '/database',
  },
];
export const PROXY_HOST = `http://${window.location.hostname}:7001`;

export const TUGRAPH_USER_NAME = 'TUGRAPH_USER_NAME';
export const TUGRAPH_PASSWORD = 'TUGRAPH_PASSWORD';
export const TUGRAPH_URI = 'TUGRAPH_URI';
export const TUGRPAH_USER_LOGIN_TIME = 'TUGRPAH_USER_LOGIN_TIME';
