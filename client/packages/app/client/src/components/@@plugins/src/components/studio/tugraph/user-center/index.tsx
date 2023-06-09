import { QuestionCircleOutlined } from '@ant-design/icons';
import { useOpenpieceUserAuth } from '@tugraph/openpiece-client';
import { Divider, Dropdown, Menu, Space, Tooltip, message } from 'antd';
import { isEmpty } from 'lodash';
import React from 'react';
import { useImmer } from 'use-immer';
import { useAuth } from '../../../studio/tugraph/hooks/useAuth';
import { getLocalData, setLocalData } from '../utils/localStorage';
import EditPasswordModal from './edit-password';

type Prop = {};
export const UserCenter: React.FC<Prop> = () => {
  const { onLogout } = useAuth();
  const { redirectLoginURL } = useOpenpieceUserAuth();
  const [state, updateState] = useImmer<{ isEditPassword: boolean }>({
    isEditPassword: false,
  });
  const { isEditPassword } = state;
  const handleLogout = () => {
    onLogout().then((res) => {
      if (res.errorCode == 200) {
        setLocalData('TUGRAPH_TOKEN', '');
        redirectLoginURL();
      } else {
        message.error('登出失败' + res.errorMessage);
      }
    });
  };
  const items = [
    {
      key: '1',
      label: (
        <div
          onClick={() => {
            updateState((draft) => {
              draft.isEditPassword = true;
            });
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
  const menu = <Menu items={items} />;
  return (
    <div>
      <Space split={<Divider type="vertical" />}>
        <Tooltip title="用户帮助">
          <QuestionCircleOutlined
            onClick={() => {
              window.open('https://tugraph.antgroup.com/doc');
            }}
          />
        </Tooltip>
        <Dropdown overlay={menu} trigger={['click']}>
          <a style={{ color: 'black' }}>
            {isEmpty(getLocalData('TUGRAPH_USER_NAME'))
              ? ''
              : getLocalData('TUGRAPH_USER_NAME')}
          </a>
        </Dropdown>
      </Space>

      <EditPasswordModal
        open={isEditPassword}
        onCancel={() => {
          updateState((draft) => {
            draft.isEditPassword = false;
          });
        }}
      />
    </div>
  );
};
