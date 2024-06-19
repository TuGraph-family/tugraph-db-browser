import {
  TUGRAPH_PASSWORD,
  TUGRAPH_URI,
  TUGRAPH_USER_NAME,
  TUGRPAH_USER_LOGIN_TIME,
} from '@/constants';
import { dbConfigRecordsTranslator } from '@/translator';
import neo4j from 'neo4j-driver';
import { history } from 'umi';

export const getLocalData = (key: string) => {
  if (!key) {
    return;
  }
  try {
    const data = JSON.parse(localStorage.getItem(key) || '');
    return data;
  } catch (e) {
    console.error(`tugraph ${key} %d ${e}`);
  }
};

export const setLocalData = (key: string, data: any) => {
  if (!key) {
    return;
  }
  localStorage.setItem(key, JSON.stringify(data));
};

// 手动登录
export const loginDB = async (params: {
  uri: string;
  userName: string;
  password: string;
}) => {
  const { uri, userName, password } = params;
  const driver = neo4j.driver(uri, neo4j.auth.basic(userName, password));
  const session = driver.session({
    defaultAccessMode: 'READ',
    database: 'default',
  });
  console.log('tugraph db login success');
  const config = await session.run('CALL dbms.config.list()').catch(e => {
    console.log(e);
  });
  let dbConfig: Record<string, any> = {};
  if (config) {
    dbConfig = dbConfigRecordsTranslator(config.records);
    const retain_connection_credentials =
      dbConfig['browser.retain_connection_credentials'];
    const credential_timeout = dbConfig['browser.credential_timeout'];
    if (retain_connection_credentials !== 'false') {
      // 手动登录
      setLocalData(TUGRAPH_USER_NAME, userName);
      setLocalData(TUGRAPH_PASSWORD, password);
      setLocalData(TUGRAPH_URI, uri);
      setLocalData(TUGRPAH_USER_LOGIN_TIME, new Date().getTime());
      // 一直在这个界面，过期跳转到登录页
      setTimeout(() => {
        session.close();
        history.push('/login');
      }, credential_timeout * 1000);
    } else {
      setLocalData(TUGRAPH_USER_NAME, null);
      setLocalData(TUGRAPH_PASSWORD, null);
      setLocalData(TUGRAPH_URI, null);
    }
  }

  return {
    session,
    dbConfig,
  };
};
