/**
 * file: Auth
 * author: Allen
*/

import React from 'react';
import { Button, Tabs } from 'antd';
import { map } from 'lodash';
import { useImmer } from 'use-immer';

/** components */
import { AccountManager } from './account-manager';
import EditRoleModal from './edit-role';
import EditAuthModal from './edit-user';
import { RoleManager } from './role-manager';

/** constants */
import { PUBLIC_PERFIX_CLASS } from '../constant';

/** styles */
import styles from './index.module.less';

export const AuthManager: React.FC = () => {
  const [state, setState] = useImmer<{
    activeTab?: 'account' | 'role';
    isOpen: boolean;
    getRefreshList: () => void;
  }>({
    activeTab: 'account',
    isOpen: false,
    getRefreshList: () => {},
  });
  const { activeTab, isOpen, getRefreshList } = state;
  const tabList = [
    {
      label: `账户管理`,
      key: 'account',
    },
    {
      label: `角色管理`,
      key: 'role',
    },
  ];
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-container`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-table-header`]}>
        <Tabs
          onChange={(value: 'account' | 'role') => {
            setState((draft) => {
              draft.activeTab = value;
            });
          }}
          defaultActiveKey="account"
        >
          {map(tabList, (tab) => (
            <Tabs.TabPane tab={tab.label} key={tab.key} />
          ))}
        </Tabs>
        <div style={{ display: 'inline-block' }}>
          <Button
            onClick={() => {
              setState((draft) => {
                draft.isOpen = true;
              });
            }}
            type="primary"
          >
            添加
          </Button>
        </div>
      </div>
      {activeTab === 'account' ? (
        <>
          <AccountManager
            getRefreshList={(getList) => {
              setState((draft) => {
                draft.getRefreshList = getList;
              });
            }}
          />
          <EditAuthModal
            type="add"
            open={isOpen}
            onRefreshAuthList={getRefreshList}
            onCancel={() => {
              setState((draft) => {
                draft.isOpen = false;
              });
            }}
          />
        </>
      ) : (
        <>
          <RoleManager
            getRefreshList={(getList) => {
              setState((draft) => {
                draft.getRefreshList = getList;
              });
            }}
          />
          <EditRoleModal
            type="add"
            open={isOpen}
            onRefreshRoleList={getRefreshList}
            onCancel={() => {
              setState((draft) => {
                draft.isOpen = false;
              });
            }}
          />
        </>
      )}
    </div>
  );
};

export default AuthManager;
