import { Button, Form, Input, InputNumber, Select, Tabs } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { filter, find, flatMapDeep, map, toArray } from 'lodash';
import React from 'react';
import { useImmer } from 'use-immer';
import SwitchDrawer from '../../../../components/switch-drawer';
import { PUBLIC_PERFIX_CLASS } from '../../../../constant';
import { useVisible } from '../../../../hooks/useVisible';
import { Condition } from '../../../../interface/query';
import { getConnectOptions } from '../../utils/getConnectOptions';

import styles from './index.module.less';

const { Item } = Form;
const { Option } = Select;
type NodeProp = {
  indexs: string;
  labelName: string;
  nodeType: string;
  primary: string;
  properties: Array<{ id: string; name: string; type: string }>;
};
type Prop = {
  nodes: Array<NodeProp>;
  nodeQuery: (limit: number, conditions: Array<Condition>, nodes: Array<CheckboxValueType>) => void;
};
export const NodeQuery: React.FC<Prop> = ({ nodes, nodeQuery }) => {
  const { visible, onShow, onClose } = useVisible({ defaultVisible: true });
  const [state, updateState] = useImmer<{
    checkAll: boolean;
    indeterminate: boolean;
    nodeCheckedList: Array<CheckboxValueType>;
  }>({
    checkAll: false,
    indeterminate: true,
    nodeCheckedList: [],
  });
  const { nodeCheckedList } = state;
  const [form] = Form.useForm();
  const nodeChange = (list: CheckboxValueType[]) => {
    updateState((draft) => {
      draft.indeterminate = !!list.length && list.length < nodes.length;
      draft.nodeCheckedList = [...list];
      draft.checkAll = list.length === nodes.length;
    });
  };
  const handleNodeQuery = () => {
    form.validateFields().then((val) => {
      const { limit } = val;
      const conditions = filter(
        flatMapDeep(map(nodeCheckedList, (item) => toArray(val[item]))),
        (condition) => condition.operator || condition.value,
      );
      nodeQuery(limit, conditions, nodeCheckedList);
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
        width={280}
        backgroundColor="#f6f6f6"
        footer={
          <>
            <Button style={{ marginRight: 8 }}>重置</Button>
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
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-drawer-title`]}>节点查询</div>
          <Form layout="vertical" form={form}>
            <div>返回节点数目</div>
            <Item name="limit" rules={[{ required: true, message: '请输入返回节点数' }]}>
              <InputNumber placeholder="请输入节点树目" />
            </Item>
            <Item required label={'选择节点'} name="selectNode" rules={[{ required: true, message: '请选择节点' }]}>
              <Select
                mode="multiple"
                options={map(nodes, (item) => ({ value: item.labelName }))}
                value={nodeCheckedList}
                onChange={nodeChange}
                maxTagCount={'responsive'}
              />
            </Item>
            <Tabs
              items={map(nodeCheckedList, (item, index) => ({
                label: item,
                key: item,
                children: map(find(nodes, (node) => node.labelName === item)?.properties, (proper) => (
                  <div>
                    <div style={{ lineHeight: '22px', margin: '16px 0 8px 0', color: 'rgba(54,55,64,1)' }}>
                      {proper.name}
                    </div>
                    <Item
                      name={[item, proper.name, 'property']}
                      className={styles[`${PUBLIC_PERFIX_CLASS}-property-container`]}
                      initialValue={`n${index}.${proper.name}`}
                    />
                    <Input.Group compact>
                      <Item
                        name={[item, proper.name, 'operator']}
                        className={styles[`${PUBLIC_PERFIX_CLASS}-select-container`]}
                      >
                        <Select placeholder="选择关系" options={getConnectOptions(proper.type)} />
                      </Item>
                      <Item
                        name={[item, proper.name, 'value']}
                        className={styles[`${PUBLIC_PERFIX_CLASS}-input-container`]}
                      >
                        {proper.type === 'BOOL' ? (
                          <Select>
                            <Select.Option value={true}>是</Select.Option>
                            <Select.Option value={false}>否</Select.Option>
                          </Select>
                        ) : (
                          <Input />
                        )}
                      </Item>
                    </Input.Group>
                  </div>
                )),
              }))}
            />
          </Form>
        </div>
      </SwitchDrawer>
    </div>
  );
};
