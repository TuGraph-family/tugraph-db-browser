import { SplitPane } from '@/components/studio/components/split-panle';
import TextTabs from '@/components/studio/components/text-tabs';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';
import { useProcedure } from '@/components/studio/hooks/useProcedure';
import { ProcedureItemParams } from '@/components/studio/interface/procedure';
import { downloadFile } from '@/components/studio/utils/downloadFile';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Empty, Modal, Popconfirm, message } from 'antd';
import { filter, find, join, last, map, xorBy } from 'lodash';
import React, { ReactNode, useCallback } from 'react';
import { useModel } from 'umi';
import { useImmer } from 'use-immer';
import { StoredCheckoutDrawer } from './stored-checkout';
import { StoredDownLoad } from './stored-download';
import { StoredKhopPanle } from './stored-khop-panle';
import { StoredList } from './stored-list';
import { StoredResult } from './stored-result';

import { InitialState } from '@/app';

import IconFont from '@/components/studio/components/icon-font';
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
      text?: ReactNode;
      key?: string;
      result?: any;
      paramValue?: string;
    }[];
    drawerVisible: boolean;
    detail: ProcedureItemParams & { type: string };
    code: string | Uint8Array;
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

  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;

  /** 兼容数据库输入输出不一致，支持映射多种字符 */
  const codeTypeMap = {
    cpp: 'CPP',
    py: 'PY',
    python: 'PY',
    so: 'CPP',
  };

  /** 统一计算procedure调用参数 */
  const paramsValue =
    tabs.find(item => item.key === selectItem)?.paramValue ??
    `{"scan_edges": true,"times": 2}`;

  const onSplitPaneHeightChange = useCallback((size: number) => {
    updateState(draft => {
      draft.height = size;
    });
  }, []);
  const getList = (newList: ProcedureItemParams[]) => {
    updateState(draft => {
      draft.list = newList;
      if (newList.length > list.length) {
        const diffElements = xorBy(newList, list, 'name');
        const newTab = diffElements.find(element => newList.includes(element));

        if (newTab && newTab.name) {
          draft.tabs = [
            ...(draft.tabs || []),
            { text: newTab.name, key: newTab.name },
          ];
          draft.detail = newTab;
          draft.selectItem = newTab.name;
        } else {
          console.log(
            "No new element found or new element doesn't have a name property",
          );
        }
      } else {
        console.log('newList is not longer than list');
      }
    });
  };
  const checkCode = async (isDownload = false) => {
    try {
      const res = await onGetProcedureCode(driver, {
        graphName,
        procedureType: codeTypeMap[detail?.type || detail?.code_type],
        procedureName: detail.name,
      });
      if (res.errorCode === '200' || res?.success) {
        const binaryData = atob(res.data[0]?.plugin_description?.code_base64);
        const pluginType = res.data[0]?.plugin_description?.code_type;
        let codeData: Uint8Array | string = '';
        let isVisible = false;

        if (pluginType === 'so') {
          codeData = new Uint8Array(binaryData.length).map((_, idx) =>
            binaryData.charCodeAt(idx),
          );
        } else {
          /** 需要用utf-8格式再次解码atob的内容 */
          codeData = new TextDecoder().decode(
            new Uint8Array(binaryData.split('').map(c => c.charCodeAt(0))),
          );
          isVisible = !isDownload;
        }

        updateState(draft => {
          draft.code = codeData;
          draft.drawerVisible = isVisible;
        });
        return codeData;
      }
    } catch (error) {
      console.log('checkCode error: ' + error);
    }
  };
  const downProcedure = async () => {
    const codeData = await checkCode(true);
    downloadFile(codeData, `${detail.name}.${detail?.code_type}`);
  };
  const deleteProcedure = () => {
    //TODO: By Allen
    onDeleteProcedure(driver, {
      graphName,
      procedureType: codeTypeMap[detail?.type || detail?.code_type],
      procedureName: detail.name,
    }).then(res => {
      if (res.errorCode === '200' || res?.success) {
        message.success('卸载成功');
        refreshList(codeTypeMap[detail?.type || detail?.code_type]);
        updateState(draft => {
          draft.tabs = filter(tabs, tab => tab.key !== detail.name);
          const activekey = last(
            filter(tabs, tab => tab.key !== detail.name),
          )?.key;
          draft.selectItem = activekey;
          draft.detail = find(
            list,
            item =>
              last(filter(tabs, tab => tab.key !== detail.name))?.key ===
              item.name,
          );
        });
      }
    });
  };
  const callProcedure = () => {
    onCallProcedure(driver, {
      graphName,
      procedureType: codeTypeMap[detail?.type || detail?.code_type],
      procedureName: detail.name,
      timeout,
      inProcess: true,
      param: paramsValue,
      version: detail.version,
    }).then(res => {
      updateState(draft => {
        draft.tabs = tabs.map(item => {
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
        disabled={selectItem === '' || detail?.code_type === 'so'}
        onClick={() => checkCode()}
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
    updateState(draft => {
      draft.detail = { ...detail };
      draft.selectItem = detail.name;
      if (!filter(tabs, tab => tab.key === detail.name).length) {
        draft.tabs = [
          ...tabs,
          {
            text: detail.name,
            key: detail.name,
          },
        ];
      }
    });
    //TODO: By Allen
  };
  const getParamValue = (value: string) => {
    updateState(draft => {
      draft.tabs = tabs.map(item => {
        if (item.key === selectItem) {
          return { ...item, paramValue: value };
        }
        return item;
      });
    });
  };
  const getTimeout = (val: number) => {
    updateState(draft => {
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
          getRefresh={refresh => {
            updateState(draft => {
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
            ' ',
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
                      tabs={map(tabs, tab => ({
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
                              onClick={e => {
                                e.stopPropagation();
                                updateState(draft => {
                                  draft.tabs = filter(
                                    tabs,
                                    item => item.key !== tab.key,
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
                      onChange={val => {
                        updateState(draft => {
                          draft.selectItem = val;
                          draft.detail = find(list, item => item.name === val);
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
                      value={paramsValue}
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
                result={tabs.find(item => item.key === selectItem)?.result}
              />
            </div>
          </SplitPane>
        </div>
        <StoredCheckoutDrawer
          value={code}
          visible={drawerVisible}
          onClose={() => {
            updateState(draft => {
              draft.drawerVisible = false;
            });
          }}
        />
        <StoredDownLoad
          demoVisible={demoVisible}
          onCancel={() => {
            updateState(draft => {
              draft.demoVisible = false;
            });
          }}
        />
      </div>
    </Modal>
  );
};
