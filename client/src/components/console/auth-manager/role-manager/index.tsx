import { Table, Popconfirm, message, Badge } from 'antd';
import React, { useEffect } from 'react';
import { PUBLIC_PERFIX_CLASS, PERSSION_COlOR } from '../../constant';
import { useImmer } from 'use-immer';
import { useRole } from '../..//hooks/useRole';
import { ColumnsType } from 'antd/lib/table';
import { map, isEmpty } from 'lodash';
import { RoleProps } from '../../interface/role';
import EditRoleModal from '../edit-role';

import styles from './index.module.less';

type Prop = {
  getRefreshList?: (fun: any) => void;
};
export const RoleManager: React.FC<Prop> = ({ getRefreshList }) => {
  const [state, setState] = useImmer<{
    isOpen: boolean;
    dataSource: Array<RoleProps>;
    type: 'add' | 'edit';
    editData: RoleProps;
  }>({
    isOpen: false,
    dataSource: [],
    type: 'add',
    editData: {},
  });
  const { dataSource, editData, isOpen, type } = state;
  const { onGetRoleList, onDeleteRole, onDisabledRole } = useRole();
  const getRoleList = () => {
    onGetRoleList().then((res) => {
      if (res.success) {
        setState((draft) => {
          draft.dataSource = map(res.data, (item) => ({
            role: item.role_name,
            description: item.role_info.description,
            permissions: item.role_info.permissions,
            disabled: item.role_info.disabled,
          }));
        });
      } else {
        message.error(res.errorMessage);
      }
    }).catch(e=>console.log(e));
  };
  const operate = (_, record: RoleProps) =>
    record.role === 'admin' ? (
      '-'
    ) : (
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
        <a
          className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-btn`]}
          onClick={() => {
            onDisabledRole({
              role: record.role,
              disabled: !record.disabled,
            }).then((res) => {
              if (res.success) {
                message.success(`${record.disabled ? '启用' : '禁用'}成功`);
                getRoleList();
              } else {
                message.error(
                  `${record.disabled ? '启用' : '禁用'}失败` + res.errorMessage
                );
              }
            });
          }}
        >
          {!record.disabled ? '禁用' : '启用'}
        </a>
        <Popconfirm
          onConfirm={() => {
            onDeleteRole({ role: record.role }).then((res) => {
              if (res.success) {
                message.success('删除成功');
                getRoleList();
              } else {
                message.error('删除失败' + res.errorMessage);
              }
            });
          }}
          title={`此操作将永久删除 ${record.role}角色，确定删除吗？`}
        >
          <a className={styles[`${PUBLIC_PERFIX_CLASS}-permissions-btn`]}>
            删除
          </a>
        </Popconfirm>
      </>
    );
  const renderPermissions = (permissions: string) => {
    const renderItem = (name, permissions) => (
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
  const columns: ColumnsType<RoleProps> = [
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: '15%',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
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
      title: '操作',
      render: operate,
      width: '15%',
    },
  ];
  useEffect(() => {
    getRoleList();
    getRefreshList(getRoleList);
  }, []);
  return (
    <>
      <Table columns={columns} bordered={false} dataSource={dataSource} />
      <EditRoleModal
        open={isOpen}
        type={type}
        data={editData}
        onRefreshRoleList={getRoleList}
        onCancel={() => {
          setState((draft) => {
            draft.isOpen = false;
          });
        }}
      />
    </>
  );
};
