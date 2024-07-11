import neo4j, { Session, Driver } from 'neo4j-driver';
import {
  TUGRAPH_PASSWORD,
  TUGRAPH_URI,
  TUGRAPH_USER_NAME,
  TUGRPAH_USER_LOGIN_TIME,
} from './constants';
import { dbConfigRecordsTranslator } from './translator';
import { getLocalData, setLocalData } from './utils';

export interface InitialState {
  session: Session;
  driver: Driver;
  userInfo: {
    userName: string;
    password: string;
  };
  dbConfig: Record<string, any>;
}

export async function getInitialState() {
  try {
    let interval: any = null;
    const userName = getLocalData(TUGRAPH_USER_NAME);
    const uri = getLocalData(TUGRAPH_URI);
    const password = getLocalData(TUGRAPH_PASSWORD);
    const driver = neo4j.driver(uri, neo4j.auth.basic(userName, password));
    const session = driver.session({
      defaultAccessMode: 'READ',
    });
    console.log('tugraph db auto login success');
    const handleSessionClose = () => {
      setLocalData(TUGRAPH_USER_NAME, null);
      setLocalData(TUGRAPH_PASSWORD, null);
      setLocalData(TUGRAPH_URI, null);
      driver.close();
      window.location.hash = '/login';
    };
    let dbConfig: Record<string, any> = {};
    const config = await session.run('CALL dbms.config.list()').catch(e => {
      console.log(e);
    });
    if (config) {
      dbConfig = dbConfigRecordsTranslator(config.records);
      const retain_connection_credentials =
        dbConfig['browser.retain_connection_credentials'];
      if (retain_connection_credentials === 'false') {
        handleSessionClose();
      } else {
        interval = setInterval(() => {
          const credential_timeout = dbConfig['browser.credential_timeout'];
          const latestLoginTime = getLocalData(TUGRPAH_USER_LOGIN_TIME);
          const isExpired =
            latestLoginTime + credential_timeout * 1000 < new Date().getTime();
          if (isExpired) {
            handleSessionClose();
            clearInterval(interval);
          }
        }, 60000);
      }
    }
    return {
      session,
      driver,
      userInfo: {
        userName,
        password,
      },
      dbConfig,
    };
  } catch (e) {
    console.error(e);
    window.location.hash = '/login';
  }
}
