import { QuestionCircleOutlined } from '@ant-design/icons';
import { Divider, Dropdown, Menu, Space, message } from 'antd';
import React from 'react';
import { isEmpty } from 'lodash';
import { useHistory } from 'umi';
import { useImmer } from 'use-immer';
import { useAuth } from '../../../studio/tugraph/hooks/useAuth';
import { getLocalData, setLocalData } from '../utils/localStorage';
import EditPasswordModal from './edit-password';

type Prop = {};
export const UserCenter: React.FC<Prop> = () => {
  const history = useHistory();
  const { onLogout } = useAuth();
  const [state, updateState] = useImmer<{ isEditPassword: boolean }>({
    isEditPassword: false,
  });
  const { isEditPassword } = state;
  const handleLogout = () => {
    onLogout().then((res) => {
      if (res.success) {
        setLocalData('TUGRAPH_TOKEN', '');
        history.push('/');
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
        <QuestionCircleOutlined
          onClick={() => {
            window.open('https://tugraph.antgroup.com/');
          }}
        />
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
