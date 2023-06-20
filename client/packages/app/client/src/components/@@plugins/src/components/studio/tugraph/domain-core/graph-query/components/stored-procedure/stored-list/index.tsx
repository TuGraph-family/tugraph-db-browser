import { PlusSquareOutlined } from '@ant-design/icons';
import { Button, Collapse, Form } from 'antd';
import { filter, join, map } from 'lodash';
import React from 'react';
import { useImmer } from 'use-immer';
import IconFont from '../../../../../components/icon-font';
import SearchInput from '../../../../../components/search-input';
import { PUBLIC_PERFIX_CLASS } from '../../../../../constant';
import { StoredForm } from './stored-form';

import { getLocalData } from '../../../../../utils';
import styles from './index.module.less';

type Prop = { graphName: string };
const { Panel } = Collapse;
export const StoredList: React.FC<Prop> = ({ graphName }) => {
  const procedureList = getLocalData('TUGRAPH_PROCEDURE_LISTS')[graphName];
  const [state, updateState] = useImmer<{
    visible: boolean;
    list: { name: string; value: any[] }[];
    activeKey: number | null;
  }>({
    visible: false,
    list: [
      {
        name: 'C++存储过程',
        value: filter(
          procedureList,
          (procedure) => procedure.procedureType === 'cpp'
        ),
      },
      {
        name: 'Python存储过程',
        value: filter(
          procedureList,
          (procedure) => procedure.procedureType === 'python'
        ),
      },
    ],
    activeKey: null,
  });
  const { visible, list, activeKey } = state;
  const [form] = Form.useForm();
  console.log(graphName);
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
                className={join(
                  [
                    styles[`${PUBLIC_PERFIX_CLASS}-list-item`],
                    activeKey === index
                      ? styles[`${PUBLIC_PERFIX_CLASS}-list-active`]
                      : '',
                  ],
                  ' '
                )}
                onClick={() => {
                  updateState((draft) => {
                    draft.activeKey = index;
                  });
                }}
              >
                <IconFont type="icon-component" />
                <span>{`${item.procedureName}.${item.codeType}`}</span>
              </div>
            ))}
          </Panel>
        ))}
      </Collapse>
      <StoredForm
        form={form}
        graphName={graphName}
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
