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


/* 数据类型 */
export const DATA_TYPE = [
  { label: 'INT8', value: 'INT8', default: 0 },
  { label: 'INT16', value: 'INT16', default: 0 },
  { label: 'INT32', value: 'INT32', default: 0 },
  { label: 'INT64', value: 'INT64', default: 0 },
  { label: 'DOUBLE', value: 'DOUBLE', default: '0.0' },
  { label: 'STRING', value: 'STRING', default: '' },
  { label: 'DATE', value: 'DATE', default: '0000-01-01' },
  { label: 'DATETIME', value: 'DATETIME', default: '0000-01-01 00:00:00' },
  // { label: 'BLOB', value: 'BLOB', default: '' },
  { label: 'BOOL', value: 'BOOL', default: false },
];
