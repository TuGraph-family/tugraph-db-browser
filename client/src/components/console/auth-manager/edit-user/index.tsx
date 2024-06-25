import { Form, Input, Modal, Select, message } from 'antd';
import { filter, find, map } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { PUBLIC_PERFIX_CLASS } from '../../constant';
import { useRole } from '../../hooks/useRole';
import { useUser } from '../../hooks/useUser';
import { UserProps } from '../../interface/user';

import styles from './index.module.less';
import { dbRecordsTranslator } from '@/translator';

const { Item } = Form;
const { Option } = Select;
type Prop = {
  onCancel: () => void;
  open: boolean;
  type: 'add' | 'edit';
  data?: UserProps;
  onRefreshAuthList?: () => void;
};
const EditAuthModal: React.FC<Prop> = ({
  onCancel,
  open,
  type,
  data,
  onRefreshAuthList,
}) => {
  const [form] = Form.useForm();
  const [state, setState] = useImmer<{
    roleList?: Array<string>;
    refreshList?: () => void;
    isAdmin: boolean;
    rawRoleData?: Array<string>;
  }>({
    roleList: [],
    refreshList: () => {},
    isAdmin: false,
    rawRoleData: [],
  });
  const { onGetRoleList } = useRole();
  const {
    onCreateUser,
    onEditUser,
    CreateUserLoading,
    EditUserLoading,
    onChangePassword,
  } = useUser();
  const { roleList, refreshList, isAdmin, rawRoleData } = state;
  const addUser = () => {
    form.validateFields().then((value) => {
      onCreateUser(value).then((res) => {
        if (res.success) {
          message.success('创建成功');
          onCancel();
          form.resetFields();
          refreshList?.();
        } else {
          message.error('创建失败');
        }
      });
    });
  };
  const editUser = () => {
    form.validateFields().then((value) => {
      onEditUser(value).then((res) => {
        if (res.success) {
          message.success('修改成功');
          onCancel();
          form.resetFields();
          refreshList?.();
        } else {
          message.error('修改失败');
        }
      });
    });
  };
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
      setState((draft) => {
        draft.isAdmin = data.username === 'admin';
      });
    }
    setState((draft) => {
      draft.refreshList = onRefreshAuthList;
    });
  }, [data, onRefreshAuthList]);

  useEffect(() => {
    onGetRoleList().then((res) => {
      if(res?.success){

        setState((draft) => {
          draft.roleList = map(res.data, (item) => item.role_name);
          draft.rawRoleData = map(res.data, (item) => item.role_name);
        });
      } else {
        message.error('获取角色列表失败' + res?.errorMessage);
      }
    })
  }, []);
  return (
    <Modal
      title={`${type === 'add' ? '添加' : '编辑'}账户`}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      visible={open}
      width={560}
      className={styles[`${PUBLIC_PERFIX_CLASS}-modal`]}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ loading: CreateUserLoading || EditUserLoading }}
      onOk={() => {
        if (type === 'add') {
          addUser();
        } else {
          editUser();
        }
      }}
    >
      <Form layout="vertical" form={form}>
        <Item
          label="账户名称"
          name="username"
          className={styles[`${PUBLIC_PERFIX_CLASS}-modal-user`]}
          required
          rules={[
            {
              required: true,
              validator: (_props, value) => {
                var reg = new RegExp(
                  '^[a-zA-Z_\u4e00-\u9fa5]{1}[a-zA-Z0-9_\u4e00-\u9fa5]{0,}$'
                );
                if (!value) {
                  return Promise.reject('请填写账户名称！');
                }
                if (!reg.test(value)) {
                  return Promise.reject('名称由中文、字母、数字、下划线组成。');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input
            disabled={type === 'edit'}
            onBlur={(e) => {
              if (
                e.target.value &&
                !find(roleList, (role) => e.target.value === role)
              ) {
                form.setFieldsValue({ roles: [e.target.value] });
                setState((draft) => {
                  draft.roleList = [...(rawRoleData || []), e.target.value];
                });
              }
              if (!e.target.value && roleList?.length !== rawRoleData?.length) {
                setState((draft) => {
                  draft.roleList = filter(
                    roleList,
                    (item, index) => roleList?.length !== index + 1
                  );
                  form.setFieldsValue({ roles: [] });
                });
              }
            }}
          />
        </Item>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-modal-text`]}>
          名称由中文、字母、数字、下划线组成。
        </div>
        <Item
          label="账户描述"
          rules={[{ required: true, message: '请输入账户描述' }]}
          name="description"
        >
          <Input.TextArea />
        </Item>
        {type === 'add' ? (
          <Item
            label="账户密码"
            rules={[{ required: true, message: '请设置账户密码' }]}
            name="password"
            required
          >
            <Input.Password />
          </Item>
        ) : (
          <Item label="新密码" name="password">
            <Input type="password" />
          </Item>
        )}

        <Item
          label="相关角色"
          name="roles"
          rules={[{ required: true, message: '请选择相关角色' }]}
        >
          <Select mode="multiple">
            {map(roleList, (item) => (
              <Option
                value={item}
                key={item}
                disabled={form.getFieldValue('username') === item}
              >
                {item}
              </Option>
            ))}
          </Select>
        </Item>
      </Form>
    </Modal>
  );
};
export default EditAuthModal;
