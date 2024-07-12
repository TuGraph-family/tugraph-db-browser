import React, { useEffect } from 'react';
import { Badge, Popconfirm, Table, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { isEmpty, join, map } from 'lodash';
import { useImmer } from 'use-immer';
import { motion } from "framer-motion";

/** components */
import EditAuthModal from '../edit-user';

/** custom hooks */
import { useUser } from '../..//hooks/useUser';

/** constants */
import { PERSSION_COlOR, PUBLIC_PERFIX_CLASS } from '../../constant';

/** type */
import { UserProps } from '../../interface/user';

/** utils */
import { getLocalData } from '../../utils/localStorage';

/** styles */
import styles from './index.module.less';

type Prop = {
  getRefreshList?: (fun: any) => void;
};
export const AccountManager: React.FC<Prop> = ({ getRefreshList }) => {
  const [state, setState] = useImmer<{
    isOpen: boolean;
    dataSource: Array<UserProps>;
    username: string;
    type: 'add' | 'edit';
    editData: UserProps;
    isFirstQuery?: boolean;
  }>({
    isOpen: false,
    dataSource: [],
    username: '',
    type: 'add',
    editData: {},
    isFirstQuery: true
  });
  const { isOpen, dataSource, username, type, editData } = state;
  const { onGetAuthList, onDisabledUser, GetAuthListLoading, onDeleteUser } =
    useUser();
  const getAuthList = (username?: string) => {
    onGetAuthList({ username }).then((res) => {
      if (res?.success) {
        setState((draft) => {
          draft.dataSource = map(res?.data, (item) => ({
            username: item.user_name,
            description: item.user_info.description,
            disabled: item.user_info.disabled,
            roles: item.user_info.roles,
            permissions: item.user_info.permissions,
          }));
          draft.isFirstQuery = false;
        });
      }
    })
  };

  const operate = (_, record: UserProps) => (
    <>
      <a
        className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-btn`]}
        onClick={() => {
          setState((draft) => {
            draft.type = 'edit';
            draft.isOpen = true;
            draft.editData = record;
          });
        }}
      >
        编辑
      </a>
      {record.username !== 'admin' &&
        record.username !== getLocalData('TUGRAPH_USER') && (
          <>
            <a
              className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-btn`]}
              onClick={() => {
                onDisabledUser({
                  username: record.username,
                  disabled: !record.disabled,
                }).then((res) => {
                  if (res.success) {
                    message.success(`${record.disabled ? '启用' : '禁用'}成功`);
                    getAuthList();
                  }
                });
              }}
            >
              {!record.disabled ? '禁用' : '启用'}
            </a>
            <Popconfirm
              onConfirm={() => {
                onDeleteUser({ username: record.username }).then((res) => {
                  if (res.success) {
                    message.success('删除成功');
                    getAuthList();
                  } else {
                    message.error('删除失败' + res.errorMessage);
                  }
                });
              }}
              title={`此操作将永久删除 ${record.username}账户，确定删除吗？`}
            >
              <a className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-btn`]}>
                删除
              </a>
            </Popconfirm>
          </>
        )}
    </>
  );
  const renderPermissions = (permissions: string) => {
    const renderItem = (name: string | number, permissions: string) => (
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-tr`]}>
        <Badge color={PERSSION_COlOR[permissions]} />
        <span style={{ margin: '0 14px 0 4px' }}>{name}</span>
      </div>
    );
    return !isEmpty(permissions)
      ? map(permissions, (item, key) => renderItem(key, item))
      : '-';
  };

  const permissionsTitle = (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-permissions`]}>
      <span style={{ marginRight: 28 }}>图权限</span>
      <Badge color="blue" />
      <span className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-dot`]}>
        全部
      </span>
      <Badge status="success" />
      <span className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-dot`]}>
        写
      </span>
      <Badge status="warning" />
      <span className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-dot`]}>
        读
      </span>
      <Badge status="default" />
      <span className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-dot`]}>
        无
      </span>
    </div>
  );
  const columns: ColumnsType<UserProps> = [
    {
      title: '账户',
      dataIndex: 'username',
      key: 'username',
      width: '15%',
    },
    {
      title: '账户描述',
      dataIndex: 'description',
      key: 'description',
      width: '15%',
      render: (text: string) => text || '-',
    },
    {
      title: permissionsTitle,
      dataIndex: 'permissions',
      key: 'permissions',
      width: '30%',
      render: renderPermissions,
    },
    {
      title: '相关角色',
      dataIndex: 'roles',
      key: 'roles',
      width: '20%',
      render: (text: Array<string>) => join(text, '、') || '-',
    },
    {
      title: '操作',
      // width: '20%',
      render: operate,
    },
  ];
  useEffect(() => {
    getAuthList(username);
  }, [username]);
  useEffect(() => {
    getRefreshList?.(getAuthList);
  }, []);

  return (
    <>
      <motion.div
        initial={{height: '100px', opacity: 0}}
        animate={{
          height: state.isFirstQuery ? '100px' : 'auto',
          opacity: state.isFirstQuery ? 0 : 1
        }}
        transition={{duration: 0.2}}
      >
        <Table
          columns={columns}
          bordered={false}
          dataSource={dataSource}
          loading={GetAuthListLoading}
        />
      </motion.div>
      <EditAuthModal
        open={isOpen}
        type={type}
        data={editData}
        onRefreshAuthList={getAuthList}
        onCancel={() => {
          setState((draft) => {
            draft.isOpen = false;
          });
        }}
      />
    </>
  );
};
