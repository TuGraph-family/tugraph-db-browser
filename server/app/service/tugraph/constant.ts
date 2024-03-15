import { log } from 'console';
import { GetEnvironmentVariables } from '../../util';
log(GetEnvironmentVariables(process.env), 'server');
const HOST = GetEnvironmentVariables(process.env);
export const HOST_URL = `http://47.105.42.70:9090`;

export const EngineServerURL = `${HOST?.tugraph_db_host}/LGraphHttpService/Query`;
