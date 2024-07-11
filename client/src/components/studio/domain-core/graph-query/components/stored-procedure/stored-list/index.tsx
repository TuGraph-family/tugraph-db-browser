import { PlusSquareOutlined } from '@ant-design/icons';
import { Button, Collapse, Form } from 'antd';
import { filter, join, map } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import IconFont from '../../../../../components/icon-font';
import SearchInput from '../../../../../components/search-input';
import { PUBLIC_PERFIX_CLASS } from '../../../../../constant';
import { useProcedure } from '../../../../../hooks/useProcedure';
import { ProcedureItemParams } from '../../../../../interface/procedure';
import { StoredForm } from './stored-form';

// hooks
import { useModel } from 'umi';

// types
import { InitialState } from '@/app';

import styles from './index.module.less';

type Prop = {
  graphName: string;
  getDetails: (detail: ProcedureItemParams) => void;
  getList: (list: ProcedureItemParams[]) => void;
  getRefresh: (fun: any) => void;
  activeValue?: string;
};
const { Panel } = Collapse;
export const StoredList: React.FC<Prop> = ({
  graphName,
  getDetails,
  getList,
  getRefresh,
  activeValue,
}) => {
  const { onGetProcedureList } = useProcedure();
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;

  /** state */
  const [state, updateState] = useImmer<{
    visible: boolean;
    list: { name: string; items: ProcedureItemParams[] }[];
    activeKey?: string;
    searchList: { name: string; items: ProcedureItemParams[] }[];
  }>({
    visible: false,
    list: [
      {
        name: 'C++存储过程',
        items: [],
      },
      {
        name: 'Python存储过程',
        items: [],
      },
    ],
    activeKey: '',
    searchList: [
      {
        name: 'C++存储过程',
        items: [],
      },
      {
        name: 'Python存储过程',
        items: [],
      },
    ],
  });
  const { visible, list, activeKey, searchList } = state;
  const [form] = Form.useForm();
  useEffect(() => {
    getList([...list[0].items, ...list[1].items]);
  }, [searchList]);
  useEffect(() => {
    updateState(draft => {
      draft.activeKey = activeValue;
    });
  }, [activeValue]);
  const refreshList = () => {

    //TODO: by Allen
    onGetProcedureList(driver, {
      graphName,
      procedureType: 'CPP'
    }).then((res: any) => {

      if (!res) return;

      updateState(draft => {
        const newItems = map(res, item => ({
          ...item.plugin_description,
        }));
        draft.list[0].items = filter(
          newItems,
          item => item.code_type !== 'python',
        );
        draft.list[1].items = filter(
          newItems,
          item => item.code_type === 'python',
        );
        draft.searchList[0].items = filter(
          newItems,
          item => item.code_type !== 'python',
        );
        draft.searchList[1].items = filter(
          newItems,
          item => item.code_type === 'python',
        );
      });
      return res;
    });
  };
  useEffect(() => {
    getRefresh(refreshList);
    refreshList();
  }, []);
  const getSearchList = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateState(draft => {
      if (e.target.value) {
        draft.list[0].items = filter(
          searchList[0].items,
          item => item.name?.indexOf(e.target.value) !== -1,
        );
        draft.list[1].items = filter(
          searchList[1].items,
          item => item.name?.indexOf(e.target.value) !== -1,
        );
      } else {
        draft.list[0].items = searchList[0].items;
        draft.list[1].items = searchList[1].items;
      }
    });
  };
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-list`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-list-search`]}>
        <SearchInput
          placeholder="请输入存储过程名称"
          onChange={getSearchList}
        />
        <Button
          type="link"
          onClick={() => {
            updateState(draft => {
              draft.visible = true;
            });
          }}
          icon={<PlusSquareOutlined />}
        >
          新建
        </Button>
      </div>
      <Collapse
        expandIconPosition="end"
        bordered={false}
        defaultActiveKey={[0, 1]}
      >
        {map(list, (item, key) => (
          <Panel header={item.name} key={key}>
            {map(item.items, (item, index) => (
              <div
                key={index}
                className={join(
                  [
                    styles[`${PUBLIC_PERFIX_CLASS}-list-item`],
                    activeKey === item.name
                      ? styles[`${PUBLIC_PERFIX_CLASS}-list-active`]
                      : '',
                  ],
                  ' ',
                )}
                onClick={() => {
                  getDetails({ ...item });
                  updateState(draft => {
                    draft.activeKey = item.name;
                  });
                }}
              >
                <IconFont type="icon-component" />
                <span>{`${item.name}`}</span>
              </div>
            ))}
          </Panel>
        ))}
      </Collapse>
      <StoredForm
        form={form}
        graphName={graphName}
        visible={visible}
        refreshList={refreshList}
        onCancel={() => {
          updateState(draft => {
            draft.visible = false;
          });
        }}
      />
    </div>
  );
};
