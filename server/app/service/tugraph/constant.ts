import { log } from 'console';
import { GetEnvironmentVariables } from '../../util';
log(GetEnvironmentVariables(process.env), 'server');
const HOST = GetEnvironmentVariables(process.env);
export const HOST_URL = `http://47.105.42.70:9090`;
export const DEV_HOST_URL = 'http://127.0.0.1:9090';
export const EngineServerURL = `${
  HOST?.tugraph_db_host ||
  (process.env?.NODE_ENV === 'production' ? DEV_HOST_URL : HOST_URL)
}/LGraphHttpService/Query`;
log(EngineServerURL, 'eng');
