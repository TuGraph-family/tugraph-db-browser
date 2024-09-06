import SwitchDrawer from '@/components/studio/components/switch-drawer';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';
import { useVisible } from '@/components/studio/hooks/useVisible';
import { Button, Form, Input, InputNumber, Select } from 'antd';
import { find, map } from 'lodash';
import React from 'react';
import { useImmer } from 'use-immer';

import { getOperatorListByValueType } from '@/domains-core/graph-analysis/graph-schema/utils/get-operator-list-by-value-type';
import { INodeQuery } from '@/types/services';
import styles from './index.module.less';

const { Item } = Form;
type NodeProp = {
  indexs: string;
  labelName: string;
  nodeType: string;
  primary: string;
  properties: Array<{ id: string; name: string; type: string }>;
};
type Prop = {
  nodes: Array<NodeProp>;
  nodeQuery: (nodeQuery: INodeQuery) => void;
};

export const NodeQuery: React.FC<Prop> = ({ nodes, nodeQuery }) => {
  const { visible, onShow, onClose } = useVisible({ defaultVisible: true });
  const [state, updateState] = useImmer<{
    properties: Array<{ id: string; name: string; type: string }>;
    logics: Array<{ value: string; label: string }>;
    propertiesType: string;
  }>({
    properties: [],
    logics: [],
    propertiesType: ''
  });
  const { properties, logics ,propertiesType} = state;
  const [form] = Form.useForm();

  /* 节点选择 */
  const nodeChange = (list: string) => {
    const newProperties =
      find(nodes, item => item?.labelName === list)?.properties || [];
    updateState(draft => {
      draft.properties = newProperties;
      draft.logics = [];
    });
    form.setFieldsValue({
      propertie: undefined,
      logic: undefined,
    });
  };

  /* 执行查询 */
  const handleNodeQuery = () => {
    form.validateFields().then(val => {
      nodeQuery({
        ...val,
        type:propertiesType
      });
    });
  };

  /* 属性选择 */
  const onSelectPropertie = (val: string) => {
    const type = find(properties, item => item.name === val)?.type;
    const newLogics = getOperatorListByValueType(type);
    updateState(draft => {
      draft.logics = newLogics;
      draft.propertiesType = type;
    });
    form.setFieldsValue({
      logic: undefined,
    });
  };

  return (
    <div
      className={`${styles[`${PUBLIC_PERFIX_CLASS}-nodequery`]} ${
        !visible ? `${styles[`${PUBLIC_PERFIX_CLASS}-nodequery-ani`]}` : ''
      }`}
    >
      <SwitchDrawer
        visible={visible}
        onShow={onShow}
        onClose={onClose}
        position="left"
        className={styles[`${PUBLIC_PERFIX_CLASS}-nodequery-drawer`]}
        width={350}
        backgroundColor="#f6f6f6"
        footer={
          <>
            <Button
              style={{ marginRight: 8 }}
              onClick={() => {
                form.resetFields();
              }}
            >
              重置
            </Button>
            <Button
              type="primary"
              onClick={() => {
                handleNodeQuery();
              }}
            >
              执行
            </Button>
          </>
        }
      >
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-drawer-ccontainer`]}>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-drawer-title`]}>
            点查询
          </div>
          <Form layout="vertical" form={form}>
            <div>返回点数目</div>
            <Item
              name="limit"
              rules={[{ required: true, message: '请输入返回点数' }]}
              initialValue={1}
            >
              <InputNumber placeholder="请输入点数目" min={1} />
            </Item>
            <Item
              required
              label={'选择点'}
              name="node"
              rules={[{ required: true, message: '请选择点' }]}
            >
              <Select
                placeholder="请选择"
                options={map(nodes, item => ({ value: item.labelName }))}
                onChange={nodeChange}
                maxTagCount={'responsive'}
              />
            </Item>
            <Item label="属性条件" required>
              <Input.Group compact>
                <Item
                  noStyle
                  required
                  name="propertie"
                  rules={[{ required: true, message: '请选择图元素属性' }]}
                >
                  <Select
                    onChange={onSelectPropertie}
                    options={map(properties, item => ({ value: item.name }))}
                    placeholder="请选择"
                    style={{ width: '35%' }}
                    showSearch
                    allowClear
                  />
                </Item>
                <Item
                  noStyle
                  required
                  name="logic"
                  rules={[{ required: true, message: '请选择查询逻辑' }]}
                >
                  <Select
                    style={{ width: '20%' }}
                    options={logics}
                    allowClear
                    notFoundContent={
                      <div style={{ textAlign: 'center' }}>No Data</div>
                    }
                  />
                </Item>
                <Item
                  noStyle
                  required
                  name="value"
                  rules={[{ required: true, message: '请输入属性值' }]}
                >
                  <Input style={{ width: '45%' }} placeholder="请输入" />
                </Item>
              </Input.Group>
            </Item>
          </Form>
        </div>
      </SwitchDrawer>
    </div>
  );
};
