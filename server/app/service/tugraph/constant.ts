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
