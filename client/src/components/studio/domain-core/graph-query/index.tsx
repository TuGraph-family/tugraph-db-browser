import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  DownloadOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';

import {
  Button,
  Divider,
  Empty,
  message,
  Popover,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tabs,
  Tooltip,
} from 'antd';
import { filter, find, isEmpty, join, map, uniqueId } from 'lodash';
import { useCallback, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import IconFont from '../../components/icon-font';
import { SplitPane } from '../../components/split-panle';
import CypherEdit from './cypherEditor';
import {
  IQUIRE_LIST,
  PUBLIC_PERFIX_CLASS,
  STORED_PROCEDURE_DESC,
  STORED_PROCEDURE_RULE,
  USER_HELP_LINK,
} from '../../constant';
import { useQuery } from '../../hooks/useQuery';
import { useSchema } from '../../hooks/useSchema';
import { SubGraph } from '../../interface/graph';
import { ExcecuteResultProp } from '../../interface/query';
import { getLocalData, setLocalData } from '../../utils';
import { downloadFile } from '../../utils/downloadFile';
import { nodesEdgesListTranslator } from '../../utils/nodesEdgesListTranslator';
import ExcecuteResultPanle from './components/excecute-result-panle';
import ModelOverview from './components/model-overview';
import { NodeQuery } from './components/node-query';
import { PathQueryPanel } from './components/path-query';
import { StatementList } from './components/statement-query-list';
import { StoredProcedureModal } from './components/stored-procedure';

import { getQueryString } from '../../utils/routeParams';
import styles from './index.module.less';

const { Option } = Select;

export const GraphQuery = () => {
  const location = window.location;
  const editorRef = useRef<any>(null);
  const graphList = getLocalData('TUGRAPH_SUBGRAPH_LIST') as SubGraph[];
  const {
    onStatementQuery,
    StatementQueryLoading,
    onPathQuery,
    PathQueryLoading,
    onNodeQuery,
    NodeQueryLoading,
  } = useQuery();
  const { onGetGraphSchema } = useSchema();
  const [state, updateState] = useImmer<{
    activeTab: string;
    isListShow: boolean;
    currentGraphName: string;
    graphListOptions: { label: string; value: string }[];
    editorWidth: number | string;
    editorHeight: number;
    pathHeight: number;
    script: string;
    resultData: Array<ExcecuteResultProp & { id?: string }>;
    queryList: Array<{
      id: string;
      value: string;
      script: string;
      isEdit?: boolean;
    }>;
    editorKey: string;
    graphData?: {
      nodes: Array<{
        indexs: string;
        labelName: string;
        nodeType: string;
        primary: string;
        properties: Array<{ id: string; name: string }>;
      }>;
      edges: Array<{
        edgeType: string;
        indexs: string;
        labelName: string;
        edgeConstraints: Array<Array<string>>;
      }>;
    };
    editor: any;
    storedVisible: boolean;
    lastResult: any;
  }>({
    graphListOptions: map(graphList, (graph: SubGraph) => {
      return {
        label: graph.graph_name,
        value: graph.graph_name,
      };
    }),
    activeTab: IQUIRE_LIST[0].key,
    isListShow: true,
    currentGraphName: getQueryString('graphName'),
    editorWidth: 350,
    editorHeight: 372,
    pathHeight: 388,
    script: 'match (n) return n limit 10',
    resultData: [],
    queryList: [],
    editorKey: '',
    graphData: { nodes: [], edges: [] },
    editor: {},
    storedVisible: false,
    lastResult: {},
  });
  const {
    activeTab,
    isListShow,
    currentGraphName,
    graphListOptions,
    editorWidth,
    editorHeight,
    pathHeight,
    script,
    resultData,
    queryList,
    editorKey,
    graphData,
    editor,
    storedVisible,
    lastResult,
  } = state;
  const columns = [
    {
      title: '',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Procedure V1',
      dataIndex: 'Procedure V1',
      key: 'Procedure V1',
    },
    {
      title: 'Procedure V2',
      dataIndex: 'Procedure V2',
      key: 'Procedure V2',
    },
  ];
  useEffect(() => {
    updateState(draft => {
      if (
        isEmpty(getLocalData('TUGRAPH_STATEMENT_LISTS')?.[currentGraphName])
      ) {
        draft.queryList = [
          {
            id: `${new Date().getTime()}`,
            value: '语句0',
            script: '',
          },
        ];
      } else {
        draft.queryList = getLocalData('TUGRAPH_STATEMENT_LISTS')[
          currentGraphName
        ];
      }
    });
    onGetGraphSchema({ graphName: currentGraphName }).then(res => {
      if (res.success) {
        updateState(draft => {
          draft.graphData = { ...res.data };
        });
      }
    });
  }, []);
  useEffect(() => {
    if (queryList.length) {
      updateState(draft => {
        draft.queryList = getLocalData('TUGRAPH_STATEMENT_LISTS')[
          currentGraphName
        ];
      });
    }
  }, [activeTab]);
  // useEffect(() => {
  //   if (location.hash) {
  //     updateState(draft => {
  //       draft.storedVisible = true;
  //     });
  //   }
  // }, []);
  const onSplitPaneWidthChange = useCallback((size: number) => {
    updateState(draft => {
      draft.editorWidth = size;
    });
  }, []);
  const onSplitPaneHeightChange = useCallback((size: number) => {
    updateState(draft => {
      draft.editorHeight = size;
    });
  }, []);
  const onSplitPanePathHeightChange = useCallback((size: number) => {
    updateState(draft => {
      draft.pathHeight = size;
    });
  }, []);
  const onResultClose = useCallback(
    (id: string) => {
      updateState(draft => {
        draft.resultData = [...filter(resultData, item => item.id !== id)];
      });
    },
    [resultData],
  );
  const handleQuery = (
    limit: number,
    conditions: Array<{ property: string; value: string; operator: string }>,
    queryParams: string,
  ) => {
    if (activeTab === IQUIRE_LIST[0].key) {
      onStatementQuery({
        graphName: currentGraphName,
        script: editorRef?.current?.codeEditor?.getValue() || script,
      }).then(res => {
        const id = uniqueId('id_');
        updateState(draft => {
          draft.resultData = [...resultData, { ...res, id }];
          draft.lastResult = { ...lastResult, [IQUIRE_LIST[0].key]: id };
        });
      });
    }
    if (activeTab === IQUIRE_LIST[1].key) {
      onPathQuery({
        graphName: currentGraphName,
        path: queryParams,
        limit,
        conditions,
      }).then(res => {
        const id = uniqueId('id_');
        updateState(draft => {
          draft.resultData = [...resultData, { ...res, id }];
          draft.lastResult = { ...lastResult, [IQUIRE_LIST[1].key]: id };
        });
      });
    }
    if (activeTab === IQUIRE_LIST[2].key) {
      onNodeQuery({
        graphName: currentGraphName,
        limit,
        conditions,
        nodes: queryParams,
      }).then(res => {
        const id = uniqueId('id_');
        updateState(draft => {
          draft.resultData = [...resultData, { ...res, id }];
          draft.lastResult = { ...lastResult, [IQUIRE_LIST[2].key]: id };
        });
      });
    }
  };

  const header = (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-header`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-headerLeft`]}>
        <ArrowLeftOutlined
          onClick={() => {
            location.hash = '/home';
          }}
        />
        <Select
          onChange={value => {
            location.hash = `/query?graphName=${value}`;
            location.reload();
          }}
          defaultValue={currentGraphName}
          options={graphListOptions}
          style={{ fontSize: 16 }}
          className={styles[`${PUBLIC_PERFIX_CLASS}-select`]}
        />
      </div>
      <Tabs
        defaultActiveKey="statement"
        centered
        items={IQUIRE_LIST}
        onChange={val => {
          updateState(draft => {
            draft.activeTab = val;
          });
        }}
      >
        {map(IQUIRE_LIST, item => (
          <Tabs.TabPane tab={item.label} key={item.key} />
        ))}
      </Tabs>
      <Space>
        <Tooltip title="用户帮助">
          <QuestionCircleOutlined
            style={{ color: 'rgba(147,147,152,1)' }}
            onClick={() => {
              window.open(USER_HELP_LINK);
            }}
          />
        </Tooltip>
        <Popover
          title="存储过程"
          placement="bottomRight"
          className="popoverTitle"
          content={
            <>
              <Table
                className={styles[`${PUBLIC_PERFIX_CLASS}-popover-table`]}
                dataSource={STORED_PROCEDURE_DESC}
                columns={columns}
                bordered
                pagination={false}
              />
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-rule`]}>
                {map(STORED_PROCEDURE_RULE, (rule, index) => (
                  <div key={index}>{rule.desc}</div>
                ))}
              </div>
            </>
          }
        >
          <img
            src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*kLPaSLhIEmoAAAAAAAAAAAAADgOBAQ/original"
            alt=""
            style={{ width: 24, height: 24 }}
            onClick={() => {
              // window.history.replaceState(
              //   null,
              //   null,
              //   `${
              //     history.location.pathname + history.location.search
              //   }#procedure`,
              // );
              updateState(draft => {
                draft.storedVisible = true;
              });
            }}
          />
        </Popover>
        <Button
          onClick={() => {
            location.hash = `/construct?graphName=${currentGraphName}`;
          }}
        >
          返回图构建
        </Button>
        <Button
          onClick={() => {
            location.hash = `/analysis?graphName=${currentGraphName}`;
          }}
        >
          前往图分析
        </Button>
      </Space>
    </div>
  );
  const actionBar = (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-right-bar`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-left-btn`]}>
        <Space split={<Divider type="vertical" />}>
          <div style={{ gap: '24px', display: 'flex' }}>
            <Select defaultValue={'Cypher'}>
              <Option value="Cypher">
                <span style={{ color: 'rgba(106,106, 112, .6)' }}>Cypher</span>
              </Option>
              <Option disabled value="ISOGQL">
                <span style={{ color: 'rgb(106,106, 112, .6)' }}>ISOGQL</span>
              </Option>
            </Select>
            <Button
              className={styles[`${PUBLIC_PERFIX_CLASS}-btn-implement`]}
              type="primary"
              onClick={handleQuery}
              loading={StatementQueryLoading}
              disabled={!script}
              icon={
                <IconFont
                  type="icon-zhihang"
                  className={
                    styles[`${PUBLIC_PERFIX_CLASS}-btn-implement-zhixing`]
                  }
                />
              }
            >
              <span
                className={styles[`${PUBLIC_PERFIX_CLASS}-btn-implement-text`]}
              >
                执行
              </span>
            </Button>
          </div>
          <div>
            <Tooltip title="保存语句">
              <Button
                type="text"
                icon={<SaveOutlined />}
                onClick={() => {
                  setLocalData(`TUGRAPH_STATEMENT_LISTS`, {
                    ...getLocalData(`TUGRAPH_STATEMENT_LISTS`),
                    [currentGraphName]: map(
                      getLocalData(`TUGRAPH_STATEMENT_LISTS`)[currentGraphName],
                      item => {
                        if (item.id === editorKey) {
                          return { ...item, script };
                        }
                        return item;
                      },
                    ),
                  });
                  message.success('保存成功');
                }}
              >
                保存
              </Button>
            </Tooltip>
            <Tooltip title="收藏为模版">
              <Button
                type="text"
                icon={<AppstoreAddOutlined />}
                onClick={() => {
                  updateState(draft => {
                    draft.queryList = [
                      ...(isEmpty(
                        getLocalData('TUGRAPH_STATEMENT_LISTS')[
                          currentGraphName
                        ],
                      )
                        ? []
                        : getLocalData('TUGRAPH_STATEMENT_LISTS')[
                            currentGraphName
                          ]),
                      {
                        id: `${new Date().getTime()}`,
                        value: '收藏语句',
                        script: script,
                      },
                    ];
                  });
                  const localData =
                    getLocalData('TUGRAPH_STATEMENT_LISTS') || {};

                  const isEmptyObj = isEmpty(localData[currentGraphName]);
                  const addItem: any = isEmptyObj
                    ? [{}]
                    : [
                        {
                          id: `${new Date().getTime()}`,
                          value: '收藏语句',
                          script: script,
                        },
                      ];
                  const addData = {
                    [currentGraphName]: [].concat(
                      localData[currentGraphName],
                      addItem,
                    ),
                  };
                  const saveData = Object.assign(localData, addData);
                  setLocalData('TUGRAPH_STATEMENT_LISTS', saveData);
                  message.success('收藏成功');
                }}
              >
                收藏
              </Button>
            </Tooltip>
            <Tooltip title="下载语句">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  downloadFile(script, '查询语句.txt');
                }}
              >
                下载
              </Button>
            </Tooltip>
          </div>
        </Space>
      </div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-right-btn`]}>
        查看图模型
        <Switch
          defaultChecked
          onChange={val => {
            updateState(draft => {
              draft.isListShow = val;
              if (val) {
                draft.editorWidth = editorWidth;
              }
            });
          }}
        />
      </div>
    </div>
  );
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-container`]}>
      {header}
      {activeTab === IQUIRE_LIST[0].key && (
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-content`]}>
          <StatementList
            list={queryList}
            garphName={currentGraphName}
            onSelect={activeId => {
              const value = find(
                getLocalData('TUGRAPH_STATEMENT_LISTS')[currentGraphName],
                item => item.id === activeId,
              )?.script;
              if (!isEmpty(editor)) {
                editorRef?.current?.codeEditor?.setValue(value);
              }
              updateState(draft => {
                draft.editorKey = activeId;
                draft.script = value;
              });
            }}
          />
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-content-right`]}>
            <div className={styles[`${PUBLIC_PERFIX_CLASS}-content-right-top`]}>
              {actionBar}
              <div
                style={{ height: '100%', position: 'relative' }}
                className={styles[`${PUBLIC_PERFIX_CLASS}-split-pane`]}
              >
                <SplitPane
                  split="horizontal"
                  defaultSize={editorHeight}
                  onChange={onSplitPaneHeightChange}
                >
                  <div
                    className={join(
                      [
                        styles[`${PUBLIC_PERFIX_CLASS}-right-center`],
                        styles[`${PUBLIC_PERFIX_CLASS}-split-pane`],
                      ],
                      ' ',
                    )}
                  >
                    <SplitPane
                      split="vertical"
                      primary="second"
                      defaultSize={isListShow ? editorWidth : 0}
                      onChange={onSplitPaneWidthChange}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: editorHeight,
                          position: 'absolute',
                          width: '100%',
                          marginTop: 20,
                        }}
                      >
                        <CypherEdit
                          ref={editorRef}
                          value={script}
                          onChange={(value: any) => {
                            updateState(draft => {
                              draft.script = value;
                            });
                          }}
                          onInit={(initEditor: any) => {
                            updateState(draft => {
                              draft.editor = initEditor;
                              if (editorKey) {
                                const value = find(
                                  getLocalData('TUGRAPH_STATEMENT_LISTS')[
                                    currentGraphName
                                  ],
                                  item => item.id === editorKey,
                                )?.script;
                                initEditor?.setValue?.(value);
                                draft.script = value;
                              }
                            });
                          }}
                        />
                      </div>
                      {isListShow && (
                        <div
                          style={{
                            width: editorWidth,
                            position: 'absolute',
                            right: 0,
                            overflow: 'hidden',
                            height: editorHeight,
                          }}
                        >
                          <ModelOverview graphName={currentGraphName} />
                        </div>
                      )}
                    </SplitPane>
                  </div>
                  <div
                    className={
                      styles[`${PUBLIC_PERFIX_CLASS}-content-right-bottom`]
                    }
                  >
                    {resultData.length ? (
                      <ExcecuteResultPanle
                        activeTabKey={activeTab}
                        queryResultList={resultData}
                        onResultClose={onResultClose}
                        graphData={graphData}
                        graphName={currentGraphName}
                        lastResult={lastResult}
                      />
                    ) : (
                      <div
                        className={styles[`${PUBLIC_PERFIX_CLASS}-bottom-spin`]}
                      >
                        <Spin spinning={StatementQueryLoading}>
                          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        </Spin>
                      </div>
                    )}
                  </div>
                </SplitPane>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === IQUIRE_LIST[1].key && (
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-path-container`]}>
          <div
            style={{ height: '100%', position: 'relative' }}
            className={styles[`${PUBLIC_PERFIX_CLASS}-split-pane`]}
          >
            <SplitPane
              split="horizontal"
              defaultSize={pathHeight}
              onChange={onSplitPanePathHeightChange}
            >
              <PathQueryPanel
                edges={nodesEdgesListTranslator('edge', graphData)}
                nodes={graphData.nodes}
                onQueryPath={handleQuery}
              />
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-path-result`]}>
                {resultData.length ? (
                  <ExcecuteResultPanle
                    activeTabKey={activeTab}
                    graphData={graphData}
                    graphName={currentGraphName}
                    queryResultList={resultData}
                    onResultClose={onResultClose}
                    lastResult={lastResult}
                  />
                ) : (
                  <div className={styles[`${PUBLIC_PERFIX_CLASS}-path-spin`]}>
                    <Spin spinning={PathQueryLoading}>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </Spin>
                  </div>
                )}
              </div>
            </SplitPane>
          </div>
        </div>
      )}
      {activeTab === IQUIRE_LIST[2].key && (
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-node-content`]}>
          <NodeQuery nodes={graphData.nodes} nodeQuery={handleQuery} />
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-node-result`]}>
            {resultData.length ? (
              <ExcecuteResultPanle
                activeTabKey={activeTab}
                graphData={graphData}
                graphName={currentGraphName}
                queryResultList={resultData}
                onResultClose={onResultClose}
                lastResult={lastResult}
              />
            ) : (
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-node-spin`]}>
                <Spin spinning={NodeQueryLoading}>
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                </Spin>
              </div>
            )}
          </div>
        </div>
      )}
      <StoredProcedureModal
        visible={storedVisible}
        graphName={currentGraphName}
        onCancel={() => {
          // window.history.replaceState(
          //   null,
          //   null,
          //   `${location.pathname + location.search}`,
          // );
          updateState(draft => {
            draft.storedVisible = false;
          });
        }}
      />
    </div>
  );
};

export default GraphQuery;
