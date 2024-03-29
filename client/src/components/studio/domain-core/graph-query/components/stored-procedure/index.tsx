import {
  ArrowLeftOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Empty, Modal, Popconfirm, message } from 'antd';
import { filter, find, join, last, map, xorBy } from 'lodash';
import React, { ReactChild, useCallback } from 'react';
import { useImmer } from 'use-immer';
import { SplitPane } from '../../../../components/split-panle';
import TextTabs from '../../../../components/text-tabs';
import { PUBLIC_PERFIX_CLASS } from '../../../../constant';
import { useProcedure } from '../../../../hooks/useProcedure';
import { ProcedureItemParams } from '../../../../interface/procedure';
import { downloadFile } from '../../../../utils/downloadFile';
import { StoredCheckoutDrawer } from './stored-checkout';
import { StoredDownLoad } from './stored-download';
import { StoredKhopPanle } from './stored-khop-panle';
import { StoredList } from './stored-list';
import { StoredResult } from './stored-result';

import IconFont from '../../../../components/icon-font';
import styles from './index.module.less';

type Props = {
  visible: boolean;
  onCancel: () => void;
  graphName: string;
};
export const StoredProcedureModal: React.FC<Props> = ({
  visible,
  onCancel,
  graphName,
}) => {
  const {
    onGetProcedureCode,
    onDeleteProcedure,
    onCallProcedure,
    CallProcedureLoading,
  } = useProcedure();
  const [state, updateState] = useImmer<{
    height: number;
    tabs: {
      text?: ReactChild;
      key?: string;
      result?: any;
      paramValue?: string;
    }[];
    drawerVisible: boolean;
    detail: ProcedureItemParams & { type: string };
    code: string;
    selectItem?: string;
    timeout: number;
    list: ProcedureItemParams[];
    refreshList: (type: 'cpp' | 'python' | 'all') => void;
    demoVisible: boolean;
  }>({
    height: 362,
    tabs: [],
    drawerVisible: false,
    detail: {},
    code: '',
    selectItem: '',
    timeout: 300,
    list: [],
    refreshList: () => {},
    demoVisible: false,
  });
  const {
    height,
    tabs,
    drawerVisible,
    detail,
    code,
    selectItem,
    timeout,
    list,
    refreshList,
    demoVisible,
  } = state;
  const onSplitPaneHeightChange = useCallback((size: number) => {
    updateState((draft) => {
      draft.height = size;
    });
  }, []);
  const getList = (newList: ProcedureItemParams[]) => {
    updateState((draft) => {
      draft.list = newList;
      if (list.length && newList.length > list.length) {
        const newTab = xorBy(list, newList, 'name')[0];
        draft.tabs = [...tabs, { text: newTab.name, key: newTab.name }];
        draft.detail = newTab;
        draft.selectItem = newTab.name;
      }
    });
  };
  const checkCode = () => {
    updateState((draft) => {
      draft.drawerVisible = true;
    });
  };
  const downProcedure = () => {
    downloadFile(code, `${detail.name}.${detail.type}`);
  };
  const deleteProcedure = () => {
    onDeleteProcedure({
      graphName,
      procedureType: detail.type,
      procedureName: detail.name,
    }).then((res) => {
      if (res.errorCode === '200') {
        message.success('卸载成功');
        refreshList(detail.type);
        updateState((draft) => {
          draft.tabs = filter(tabs, (tab) => tab.key !== detail.name);
          const activekey = last(
            filter(tabs, (tab) => tab.key !== detail.name)
          )?.key;
          draft.selectItem = activekey;
          draft.detail = find(
            list,
            (item) =>
              last(filter(tabs, (tab) => tab.key !== detail.name))?.key ===
              item.name
          );
        });
      }
    });
  };
  const callProcedure = () => {
    onCallProcedure({
      graphName,
      procedureType: detail.type,
      procedureName: detail.name,
      timeout,
      inProcess: true,
      param: tabs.find((item) => item.key === selectItem)?.paramValue,
      version: detail.version,
    }).then((res) => {
      updateState((draft) => {
        draft.tabs = tabs.map((item) => {
          if (item.key === selectItem) {
            return { ...item, result: res };
          }
          return item;
        });
      });
    });
  };

  const ActionBar = (
    <div
      className={
        styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-bar`]
      }
    >
      <Button
        className={styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-callbtn`]}
        onClick={callProcedure}
        disabled={selectItem === ''}
        type="primary"
        loading={CallProcedureLoading}
      >
        {!CallProcedureLoading && (
          <IconFont
            type="icon-zhihang"
            style={{
              fontSize: 23,
              position: 'absolute',
              top: 3,
              left: 6,
            }}
          />
        )}
        执行
      </Button>
      <Button
        disabled={selectItem === ''}
        onClick={checkCode}
        type="text"
        icon={<EyeOutlined />}
      >
        查看源码
      </Button>
      <Button
        disabled={selectItem === ''}
        type="text"
        icon={<DownloadOutlined />}
        onClick={downProcedure}
      >
        下载
      </Button>
      <Popconfirm
        title="确定要卸载吗？"
        onConfirm={deleteProcedure}
        okText="是"
        cancelText="否"
        disabled={selectItem === ''}
      >
        <Button
          disabled={selectItem === ''}
          type="text"
          icon={<DeleteOutlined />}
        >
          卸载
        </Button>
      </Popconfirm>
    </div>
  );
  const getDetails = (detail: ProcedureItemParams) => {
    updateState((draft) => {
      draft.detail = { ...detail };
      draft.selectItem = detail.name;
      if (!filter(tabs, (tab) => tab.key === detail.name).length) {
        draft.tabs = [
          ...tabs,
          {
            text: detail.name,
            key: detail.name,
          },
        ];
      }
    });
    onGetProcedureCode({
      graphName,
      procedureType: detail.type,
      procedureName: detail.name,
    }).then((res) => {
      if (res.errorCode === '200') {
        updateState((draft) => {
          draft.code = atob(res.data.content);
        });
      }
    });
  };
  const getParamValue = (value: string) => {
    updateState((draft) => {
      draft.tabs = tabs.map((item) => {
        if (item.key === selectItem) {
          return { ...item, paramValue: value };
        }
        return item;
      });
    });
  };
  const getTimeout = (val: number) => {
    updateState((draft) => {
      draft.timeout = val;
    });
  };
  return (
    <Modal
      className={styles[`${PUBLIC_PERFIX_CLASS}-stored-modal`]}
      mask={false}
      visible={visible}
      onCancel={onCancel}
      closable={false}
      title={
        <>
          <ArrowLeftOutlined onClick={onCancel} />
          <span>存储过程</span>
        </>
      }
    >
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-content`]}>
        <StoredList
          graphName={graphName}
          getDetails={getDetails}
          getList={getList}
          getRefresh={(refresh) => {
            updateState((draft) => {
              draft.refreshList = refresh;
            });
          }}
          activeValue={selectItem}
        />
        <div
          className={join(
            [
              styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-content-right`],
              styles[`${PUBLIC_PERFIX_CLASS}-split-pane`],
            ],
            ' '
          )}
        >
          <SplitPane
            split="horizontal"
            defaultSize={height}
            onChange={onSplitPaneHeightChange}
          >
            <div
              className={
                styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-top`]
              }
            >
              {tabs.length ? (
                <>
                  <div
                    className={
                      styles[
                        `${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-top-tab`
                      ]
                    }
                  >
                    <TextTabs
                      type="card"
                      tabs={map(tabs, (tab) => ({
                        text: (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            <div>{tab.text}</div>
                            <CloseOutlined
                              onClick={(e) => {
                                e.stopPropagation();
                                updateState((draft) => {
                                  draft.tabs = filter(
                                    tabs,
                                    (item) => item.key !== tab.key
                                  );
                                  if (tab.key === selectItem) {
                                    draft.selectItem = '';
                                    draft.detail = {};
                                  }
                                });
                              }}
                            />
                          </div>
                        ),
                        key: tab.key,
                      }))}
                      activeTab={selectItem}
                      autoWidth={false}
                      onChange={(val) => {
                        updateState((draft) => {
                          draft.selectItem = val;
                          draft.detail = find(
                            list,
                            (item) => item.name === val
                          );
                        });
                      }}
                    />
                  </div>
                  {ActionBar}
                  <div
                    className={
                      styles[
                        `${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-top-content`
                      ]
                    }
                  >
                    <StoredKhopPanle
                      getParamValue={getParamValue}
                      value={
                        tabs.find((item) => item.key === selectItem)?.paramValue
                      }
                      detail={detail}
                      selectItem={selectItem}
                      getTimeout={getTimeout}
                    />
                  </div>
                </>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </div>
            <div
              className={
                styles[
                  `${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-bottom`
                ]
              }
            >
              <StoredResult
                result={tabs.find((item) => item.key === selectItem)?.result}
              />
            </div>
          </SplitPane>
        </div>
        <StoredCheckoutDrawer
          value={code}
          visible={drawerVisible}
          onClose={() => {
            updateState((draft) => {
              draft.drawerVisible = false;
            });
          }}
        />
        <StoredDownLoad
          demoVisible={demoVisible}
          onCancel={() => {
            updateState((draft) => {
              draft.demoVisible = false;
            });
          }}
        />
      </div>
    </Modal>
  );
};
