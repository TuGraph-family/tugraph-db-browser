import {
  TUGRAPH_PASSWORD,
  TUGRAPH_URI,
  TUGRAPH_USER_NAME,
  TUGRPAH_USER_LOGIN_TIME,
} from '@/constants';
import { dbConfigRecordsTranslator } from '@/translator';
import neo4j from 'neo4j-driver';
import { isEmpty, forEach, map, find, merge } from 'lodash';
import {
  IRoleRespons,
  IUserRespons,
} from '../../../server/app/service/tugraph/interface';

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
        window.location.hash = '/login';
      }, credential_timeout * 1000);
    } else {
      setLocalData(TUGRAPH_USER_NAME, null);
      setLocalData(TUGRAPH_PASSWORD, null);
      setLocalData(TUGRAPH_URI, null);
    }
  }

  return {
    driver,
    session,
    dbConfig,
  };
};

export const userInfoTranslator = (
  userList: IUserRespons[],
  roleList: IRoleRespons[],
) => {
  if (isEmpty(userList)) {
    return [];
  }
  if (isEmpty(roleList)) {
    return userList;
  }
  return map(userList, (user: IUserRespons) => {
    if (isEmpty(user?.user_info?.roles)) {
      return user;
    }
    let permissions = {};

    forEach(user.user_info.roles, roleName => {
      const targetPermissions = find(
        roleList,
        (role: IRoleRespons) => role.role_name === roleName,
      )?.role_info?.permissions;
      if (!isEmpty(targetPermissions)) {
        merge(permissions, targetPermissions);
      }
    });

    return {
      user_name: user.user_name,
      user_info: {
        permissions,
        ...user.user_info,
      },
    };
  });
};

export const convertPermissions = (permissions: Record<string, string>) => {
  let result = `{`;
  const permissionList = Object.entries(permissions);
  forEach(permissionList, ([key, value], index) => {
    if (index === permissionList.length - 1) {
      result += `${key}: '${value}'}`;
    } else {
      result += `${key}: '${value}',`;
    }
  });
  return result;
};

/* 纯数字字符串转number类型 */
export const convertToNumber = (input: string,type: string) => {
  //int类型neo4j.int转下
  if(['INT8','INT16','INT32','INT64'].includes(type)){
    return neo4j.int(Number(input))
  }
  if(type === 'DOUBLE'){
    return Number(input)
  }
  if(type === 'BOOL'){
    return input === 'true'
  }
  return input

};

/* 处理选中点边映射值类型 */
export const getProperties = (param: {
  type: string;
  name: string;
  graphData: any;
}) => {
  const { type, name, graphData } = param;

  if (type === 'node') {
    return  graphData.nodes?.find(item=>item.labelName === name)?.properties
  } else {
    return  graphData.edges?.find(item=>item.labelName === name)?.properties
  }
};
