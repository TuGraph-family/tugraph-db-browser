import {
  DeleteOutlined,
  EditOutlined,
  MacCommandOutlined,
  PlusSquareOutlined,
} from '@ant-design/icons';
import { Input, Popconfirm, Select, Tooltip } from 'antd';
import { filter, join, map, omit } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import SearchInput from '../../../../components/search-input';
import SwitchDrawer from '../../../../components/switch-drawer';
import { PUBLIC_PERFIX_CLASS } from '../../../../constant';
import { useVisible } from '../../../../hooks/useVisible';
import { getLocalData, setLocalData } from '../../../../utils';

import styles from './index.module.less';

const { Option } = Select;
type Prop = {
  garphName: string;
  onSelect: (id: string) => void;
  list: Array<{ id: string; value: string; script: string; isEdit?: boolean }>;
};

export const StatementList: React.FC<Prop> = ({
  garphName,
  onSelect,
  list,
}) => {
  const { visible, onShow, onClose } = useVisible({ defaultVisible: true });
  const [state, updateState] = useImmer<{
    queryList: Array<{
      id: string;
      value: string;
      script: string;
      isEdit?: boolean;
    }>;
    activeId: string;
  }>({
    queryList: list,
    activeId: '',
  });
  useEffect(() => {
    if (garphName && list?.length) {
      updateState(draft => {
        draft.queryList = [...list];
      });
      setLocalData(`TUGRAPH_STATEMENT_LISTS`, {
        ...getLocalData('TUGRAPH_STATEMENT_LISTS'),
        [garphName]: list,
      });

    }
  }, [list]);
  const { queryList, activeId } = state;
  const addStatement = () => {
    updateState(draft => {
      const newList = [
        ...queryList,
        {
          id: `${new Date().getTime()}`,
          value: `语句${queryList.length}`,
          script: '',
        },
      ];
      draft.queryList = newList;
      setLocalData(`TUGRAPH_STATEMENT_LISTS`, {
        ...getLocalData('TUGRAPH_STATEMENT_LISTS'),
        [garphName]: newList,
      });
    });
  };
  const editStatement = (id: string) => {
    updateState(draft => {
      const newList = map(queryList, item => {
        if (item.id === id) {
          return { ...item, isEdit: true };
        }
        return item;
      });
      draft.queryList = newList;
      setLocalData(`TUGRAPH_STATEMENT_LISTS`, {
        ...getLocalData('TUGRAPH_STATEMENT_LISTS'),
        [garphName]: newList,
      });
    });
  };
  const deleteStatement = (id: string) => {
    updateState(draft => {
      const newList = filter(queryList, item => item.id !== id);
      draft.queryList = newList;
      setLocalData(`TUGRAPH_STATEMENT_LISTS`, {
        ...getLocalData('TUGRAPH_STATEMENT_LISTS'),
        [garphName]: newList,
      });
    });
  };
  const searchStatement = (searchKeyword: string) => {
    updateState(draft => {
      draft.queryList = filter(
        getLocalData('TUGRAPH_STATEMENT_LISTS')[garphName],
        item => item.value.indexOf(searchKeyword) != -1,
      );
    });
  };
  return (
    <div
      className={`${styles[`${PUBLIC_PERFIX_CLASS}-statement`]} ${
        !visible ? `${styles[`${PUBLIC_PERFIX_CLASS}-statement-ani`]}` : ''
      }`}
    >
      <SwitchDrawer
        visible={visible}
        onShow={onShow}
        onClose={onClose}
        position="left"
        className={styles[`${PUBLIC_PERFIX_CLASS}-statement-drawer`]}
        width={280}
        backgroundColor="#f6f6f6"
      >
        <div
          className={styles[`${PUBLIC_PERFIX_CLASS}-statement-drawer-content`]}
        >
          <div
            className={
              styles[`${PUBLIC_PERFIX_CLASS}-statement-drawer-content-title`]
            }
          >
            语句查询
            <PlusSquareOutlined onClick={addStatement} />
          </div>
          <div
            className={
              styles[`${PUBLIC_PERFIX_CLASS}-statement-drawer-content-search`]
            }
          >
            <SearchInput
              placeholder="请输入搜索关键字"
              bordered={false}
              onSearch={keyword => {
                searchStatement(keyword);
              }}
            />
            <div
              className={
                styles[`${PUBLIC_PERFIX_CLASS}-statement-drawer-content-list`]
              }
            >
              {map(queryList, (item, index) => (
                <div
                  key={item.id}
                  className={join(
                    [
                      styles[
                        `${PUBLIC_PERFIX_CLASS}-statement-drawer-content-list-item`
                      ],
                      activeId === item.id
                        ? styles[
                            `${PUBLIC_PERFIX_CLASS}-statement-drawer-content-list-active`
                          ]
                        : '',
                    ],
                    ' ',
                  )}
                  onClick={() => {
                    updateState(draft => {
                      draft.activeId = item.id;
                      onSelect?.(item.id);
                    });
                  }}
                >
                  <div
                    className={
                      styles[
                        `${PUBLIC_PERFIX_CLASS}-statement-drawer-content-list-left`
                      ]
                    }
                  >
                    <MacCommandOutlined />
                    {item.isEdit ? (
                      <Input
                        defaultValue={item.value}
                        autoFocus={true}
                        onBlur={e => {
                          updateState(draft => {
                            draft.queryList = map(queryList, statement => {
                              if (statement.id === item.id) {
                                return {
                                  ...statement,
                                  isEdit: false,
                                  value: e.target.value,
                                };
                              }
                              return statement;
                            });
                            setLocalData(`TUGRAPH_STATEMENT_LISTS`, {
                              ...getLocalData('TUGRAPH_STATEMENT_LISTS'),
                              [garphName]: map(queryList, statement => {
                                if (statement.id === item.id) {
                                  return omit(
                                    {
                                      ...statement,
                                      value: e.target.value,
                                    },
                                    'isEdit',
                                  );
                                }
                                return statement;
                              }),
                            });
                          });
                        }}
                      />
                    ) : (
                      <Tooltip title={item.value}>
                        <div
                          className={
                            styles[
                              `${PUBLIC_PERFIX_CLASS}-statement-drawer-content-list-text`
                            ]
                          }
                        >
                          {item.value}
                        </div>
                      </Tooltip>
                    )}
                  </div>
                  <div>
                    <EditOutlined
                      onClick={e => {
                        e.stopPropagation();
                        editStatement(item.id);
                      }}
                    />
                    {queryList?.length > 1 ? (
                      <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={e => {
                          e?.stopPropagation();
                          deleteStatement(item.id);
                        }}
                        okText="确定"
                        cancelText="取消"
                      >
                        <DeleteOutlined
                          onClick={e => {
                            e.stopPropagation();
                          }}
                        />
                      </Popconfirm>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SwitchDrawer>
    </div>
  );
};

export default StatementList;
