import { Form, Input, Modal, Radio, Table, message } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { map } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import {
  PERSSIONS_ENUM,
  PERSSIONS_ENUM_TEXT,
  PUBLIC_PERFIX_CLASS,
} from '../../constant';
import { useGraph } from '../../hooks/useGraph';
import { useRole } from '../../hooks/useRole';
import { RoleProps } from '../../interface/role';
import { getLocalData } from '../../utils/localStorage';

import styles from './index.module.less';

const { Item } = Form;
type Prop = {
  onCancel: () => void;
  open: boolean;
  type: 'add' | 'edit';
  data?: RoleProps;
  onRefreshRoleList?: () => void;
};
const EditRoleModal: React.FC<Prop> = ({
  onCancel,
  open,
  type,
  data,
  onRefreshRoleList,
}) => {
  const [form] = Form.useForm();
  const [state, setState] = useImmer<{
    graphList?: Array<{ graphName: string }>;
    refreshList?: () => void;
  }>({
    graphList: [],
    refreshList: () => {},
  });
  const { onGetGraphList } = useGraph();
  const { onCreateRole, onEditRole, CreateRoleLoading, EditRoleLoading } =
    useRole();
  const { refreshList, graphList } = state;
  const addRole = () => {
    form.validateFields().then((value) => {
      onCreateRole(value).then((res) => {
        if (res.success) {
          message.success('创建成功');
          onCancel();
          form.resetFields();
          refreshList?.();
        } else {
          message.error('创建失败' + res.errorMessage);
        }
      });
    });
  };
  const editRole = () => {
    form.validateFields().then((value) => {
      onEditRole(value).then((res) => {
        if (res.success) {
          message.success('修改成功');
          onCancel();
          form.resetFields();
          refreshList?.();
        } else {
          message.error('修改失败' + res.errorMessage);
        }
      });
    });
  };
  const columns: ColumnsType<{ graphName: string }> = [
    {
      dataIndex: 'graphName',
      title: '图名称',
      key: 'graphName',
      width: '30%',
    },
    {
      dataIndex: 'permissions',
      title: '权限',
      key: 'permissions',
      width: '70%',
      render: (_, record) => (
        <Item
          name={['permissions', record.graphName]}
          noStyle
          initialValue={PERSSIONS_ENUM.NONE}
        >
          <Radio.Group>
            {map(PERSSIONS_ENUM_TEXT, (item) => (
              <Radio value={item.value} key={item.value}>
                {item.label}
              </Radio>
            ))}
          </Radio.Group>
        </Item>
      ),
    },
  ];
  useEffect(() => {
    if (data) {
      form.setFieldsValue(data);
    }
    setState((draft) => {
      draft.refreshList = onRefreshRoleList;
    });
  }, [data, onRefreshRoleList]);
  useEffect(() => {
    onGetGraphList().then(
      (res) => {
        if (res.success) {
          setState((draft) => {
            draft.graphList = map(res.data, (item) => ({
              graphName: item.graph_name,
            }));
          });
        } else {
          message.error('获取图权限列表失败' + res.errorMessage);
        }
      }
    ).catch(e=>console.log(e));;
  }, []);
  return (
    <Modal
      title={`${type === 'add' ? '添加' : '编辑'}角色`}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      visible={open}
      width={560}
      className={styles[`${PUBLIC_PERFIX_CLASS}-modal`]}
      okText="确定"
      cancelText="取消"
      okButtonProps={{ loading: CreateRoleLoading || EditRoleLoading }}
      onOk={() => {
        if (type === 'add') {
          addRole();
        } else {
          editRole();
        }
      }}
    >
      <Form layout="vertical" form={form}>
        <Item
          label="角色名称"
          name="role"
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
                  return Promise.reject('请填写角色名称！');
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
          <Input disabled={type === 'edit'} />
        </Item>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-modal-text`]}>
          名称由中文、字母、数字、下划线组成。
        </div>
        <Item
          label="角色描述"
          rules={[{ required: true, message: '请输入用户描述' }]}
          name="description"
        >
          <Input.TextArea />
        </Item>
        <Table
          columns={columns}
          dataSource={graphList}
          bordered
          pagination={false}
          scroll={{ y: 240 }}
        />
      </Form>
    </Modal>
  );
};
export default EditRoleModal;
