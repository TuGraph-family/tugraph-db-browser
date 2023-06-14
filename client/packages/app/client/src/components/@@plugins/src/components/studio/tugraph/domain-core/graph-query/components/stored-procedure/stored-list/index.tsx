import { PlusSquareOutlined } from '@ant-design/icons';
import { Button, Collapse, Form } from 'antd';
import { map } from 'lodash';
import React from 'react';
import { useImmer } from 'use-immer';
import IconFont from '../../../../../components/icon-font';
import SearchInput from '../../../../../components/search-input';
import { PUBLIC_PERFIX_CLASS } from '../../../../../constant';
import { StoredForm } from './stored-form';

import styles from './index.module.less';

type Prop = {};
const { Panel } = Collapse;
const list = [
  { name: 'C++存储过程', value: [{ label: 'KHOP' }, { label: 'KHOP' }] },
  { name: 'Python存储过程', value: [{ label: 'KHOP' }] },
];
export const StoredList: React.FC<Prop> = () => {
  const [state, updateState] = useImmer<{ visible: boolean }>({
    visible: false,
  });
  const { visible } = state;
  const [form] = Form.useForm();
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-list`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-list-search`]}>
        <SearchInput placeholder="请输入存储过程名称" />
        <Button
          type="link"
          onClick={() => {
            updateState((draft) => {
              draft.visible = true;
            });
          }}
          icon={<PlusSquareOutlined />}
        >
          新建
        </Button>
      </div>
      <Collapse expandIconPosition="end" bordered={false}>
        {map(list, (item, key) => (
          <Panel header={item.name} key={key}>
            {map(item.value, (item, index) => (
              <div
                key={index}
                className={styles[`${PUBLIC_PERFIX_CLASS}-list-item`]}
              >
                <IconFont type="icon-component" />
                <span>{item.label}</span>
              </div>
            ))}
          </Panel>
        ))}
      </Collapse>
      <StoredForm
        form={form}
        visible={visible}
        onCancel={() => {
          updateState((draft) => {
            draft.visible = false;
          });
        }}
      />
    </div>
  );
};
