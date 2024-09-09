import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, Dropdown, Space, Tooltip,} from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import { useModel } from 'umi';
import { getLocalData, setLocalData } from '../utils/localStorage';
import {
  USER_HELP_LINK
} from '../constant';
import {
  TUGRAPH_PASSWORD,
  TUGRAPH_URI,
  TUGRAPH_USER_NAME,
} from '@/constants';
import { InitialState } from '@/app';



type Prop = {};
export const UserCenter: React.FC<Prop> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const handleLogout = () => {
    setInitialState({...initialState, userInfo: {}} as InitialState)
      .then(() => {
        setLocalData(TUGRAPH_USER_NAME, null);
        setLocalData(TUGRAPH_PASSWORD, null);
        setLocalData(TUGRAPH_URI, null);
        initialState?.session?.close();
          window.location.hash = '/login';
        })
      .catch((err) => console.log('error:', err))};
  const items = [
    {
      key: '1',
      label: (
        <div
          onClick={() => {
           window.location.hash = '/reset'
          }}
        >
          修改密码
        </div>
      ),
    },
    {
      key: '2',
      label: <div onClick={handleLogout}>退出登录</div>,
    },
  ];
  return (
    <div>
      <Space split={<Divider type="vertical" />}>
        <Tooltip title="用户帮助">
          <QuestionCircleOutlined
            onClick={() => {
              window.open(USER_HELP_LINK);
            }}
          />
        </Tooltip>
        <Dropdown menu={{items}} trigger={['click']}>
          <a style={{ color: 'black' }}>
            {isEmpty(getLocalData('TUGRAPH_USER_NAME'))
              ? ''
              : getLocalData('TUGRAPH_USER_NAME')}
          </a>
        </Dropdown>
      </Space>
    </div>
  );
};
