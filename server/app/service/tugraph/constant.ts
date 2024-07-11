import { GetEnvironmentVariables } from '../../util';
import env from '../../../../env.json';
const HOST = GetEnvironmentVariables(process.env);

export const HOST_URL = `http://47.105.42.70:9090`;
export const DEV_HOST_URL = 'http://127.0.0.1:9090';
export const EngineServerURL = `${
  env?.tugraph_db_host ||
  HOST?.tugraph_db_host ||
  (process.env?.NODE_ENV === 'production' ? DEV_HOST_URL : HOST_URL)
}/LGraphHttpService/Query`;
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
