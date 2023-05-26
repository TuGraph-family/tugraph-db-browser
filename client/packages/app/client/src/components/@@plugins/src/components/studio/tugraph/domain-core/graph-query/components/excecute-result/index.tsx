import Graphin, { GraphinContextType, Layout } from '@antv/graphin';
import {
  Button,
  Empty,
  Form,
  Input,
  Radio,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import copy from 'copy-to-clipboard';
import JSONBig from 'json-bigint';
import { map, round } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import ReactJSONView from 'react-json-view';
import { useImmer } from 'use-immer';
import {
  GraphCanvas,
  GraphCanvasContext,
  GraphCanvasContextInitValue,
} from '../../../../components/garph-canvas';
import { GraphCanvasLayout } from '../../../../components/graph-canvas-layout';
import { GraphCanvasTools } from '../../../../components/graph-canvas-tools';
import IconFont from '../../../../components/icon-font';
import IconItem from '../../../../components/icon-item';
import SwitchDrawer from '../../../../components/switch-drawer';
import { PUBLIC_PERFIX_CLASS } from '../../../../constant';
import { useVisible } from '../../../../hooks/useVisible';
import {
  ExcecuteResultProp,
  FormatDataEdgeProp,
  FormatDataNodeProp,
} from '../../../../interface/query';
import {
  EXCECUTE_RESULT_TABLE,
  EXCECUTE_RESULT_TABLE_OPTIONS,
} from '../../constant';

import styles from './index.module.less';

const { TabPane } = Tabs;
const { Group } = Radio;

interface ResultProps {
  excecuteResult?: ExcecuteResultProp;
}

const ExecuteResult: React.FC<ResultProps> = ({ excecuteResult }) => {
  const { originalData, formatData } = excecuteResult?.data || {};
  const { visible, onShow, onClose } = useVisible({ defaultVisible: false });
  const { nodes, edges } = formatData || {};
  const [state, setState] = useImmer<{
    tableType: 'nodes' | 'edges';
    currentLayout: Layout;
    graphCanvasContextValue: GraphinContextType;
    activeKey: string;
    properties: Record<string, string | boolean | any>;
    activeElementType: 'node' | 'edge' | any;
    tagName: string;
    id: string;
    formDisable: boolean;
  }>({
    tableType: 'nodes',
    currentLayout: { type: 'graphin-force', animation: false },
    graphCanvasContextValue: GraphCanvasContextInitValue,
    activeKey: 'JSON',
    properties: {},
    activeElementType: 'node',
    tagName: '',
    id: '',
    formDisable: true,
  });
  const {
    tableType,
    currentLayout,
    graphCanvasContextValue,
    activeKey,
    properties,
    activeElementType,
    tagName,
    id,
    formDisable,
  } = state;
  const modalGraphRef = React.createRef<Graphin>();
  const onTableTypeChange = (e: any) => {
    setState((draft) => {
      draft.tableType = e.target.value;
    });
  };
  const onLayoutChange = useCallback((layout: Layout) => {
    setState((draft) => {
      draft.currentLayout = layout;
    });
  }, []);
  const getGraphCanvasContextValue = useCallback((contextValue: any) => {
    setState((draft) => {
      if (contextValue) {
        draft.graphCanvasContextValue = contextValue;
      }
    });
  }, []);

  useEffect(() => {
    const canvasContainer = document.querySelector(`.canvas`);
    const objResizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }
        entries.forEach((entry) => {
          const cr = entry.contentRect;
          graphCanvasContextValue?.graph?.changeSize(cr.width, cr.height);
          graphCanvasContextValue?.graph?.fitCenter();
        });
      });
    });
    if (canvasContainer) {
      objResizeObserver.observe(canvasContainer);
    }
    graphCanvasContextValue.graph?.on('node:click', (val) => {
      setState((draft) => {
        draft.id = val.item._cfg.id;
        draft.tagName = val.item._cfg.model.label;
        draft.activeElementType = val.item._cfg.type;
        draft.properties = { ...val.item._cfg.model.properties };
        onShow();
      });
    });
    graphCanvasContextValue.graph?.on('edge:click', (val) => {
      setState((draft) => {
        draft.id = val.item._cfg.id;
        draft.tagName = val.item._cfg.model.label;
        draft.activeElementType = val.item._cfg.type;
        draft.properties = { ...val.item._cfg.model.properties };
        onShow();
      });
    });
    return () => {
      if (canvasContainer) {
        objResizeObserver.unobserve(canvasContainer);
      }
    };
  }, [graphCanvasContextValue]);

  useEffect(() => {
    if (modalGraphRef && modalGraphRef.current) {
      modalGraphRef.current.graph?.changeSize(
        document.body.clientWidth,
        document.body.clientHeight
      );
      modalGraphRef.current?.graph.fitCenter();
    }
  }, [modalGraphRef.current]);
  useEffect(() => {
    if (formatData) {
      setState((draft) => {
        draft.activeKey = 'canvas';
      });
    }
    graphCanvasContextValue?.graph?.refresh();
  }, [excecuteResult]);
  const dealFormatData = (formatData: {
    nodes: Array<FormatDataNodeProp>;
    edges: Array<FormatDataEdgeProp>;
  }) => {
    const newNodes = map(formatData?.nodes, (item) => ({
      ...item,
      style: { label: { value: item.properties?.name || item.label } },
    }));
    const newEdge = map(formatData?.edges, (item) => ({
      ...item,
      style: {
        label: {
          value: item.properties?.name || item.label,
          fill: 'rgba(0,0,0,0.85)',
        },
      },
    }));
    return { nodes: newNodes, edges: newEdge };
  };
  const copyScript = (
    <div
      className={
        styles[
          `${PUBLIC_PERFIX_CLASS}-script${
            activeKey === 'canvas' ? '-canvas' : ''
          }`
        ]
      }
    >
      <Tooltip title="复制">
        <IconFont
          type="icon-fuzhi1"
          className={styles[`${PUBLIC_PERFIX_CLASS}-icon-copy`]}
          onClick={() => {
            copy(excecuteResult?.script);
          }}
        />
      </Tooltip>
      <span style={{ marginLeft: 22 }}> {excecuteResult?.script}</span>
    </div>
  );
  return (
    <GraphCanvasContext.Provider value={{ ...graphCanvasContextValue }}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-excecute-result`]}>
        {activeKey === 'canvas' && copyScript}
        <Tabs
          type="card"
          tabPosition="left"
          activeKey={activeKey}
          style={{
            height: activeKey === 'canvas' ? 'calc(100% - 42px)' : '100%',
          }}
          onChange={(val) => {
            setState((draft) => {
              draft.activeKey = val;
            });
          }}
        >
          <TabPane
            key="JSON"
            tab={<IconItem icon="icon-read" name="JSON视图" />}
          >
            {copyScript}
            <ReactJSONView src={originalData} displayDataTypes={false} />
          </TabPane>
          <TabPane
            key="JSONText"
            tab={<IconItem icon="icon-JSONwenben" name="JSON文本" />}
          >
            {copyScript}
            <pre style={{ whiteSpace: 'break-spaces' }}>
              {JSONBig.stringify(originalData, null, 2)}
            </pre>
          </TabPane>
          <TabPane
            key="table"
            tab={
              <IconItem
                icon="icon-dianbianliebiao"
                name="点边列表"
                style={{ marginLeft: -5 }}
              />
            }
          >
            {copyScript}
            <div className={styles[`${PUBLIC_PERFIX_CLASS}-tableHeader`]}>
              <Group
                value={tableType}
                options={EXCECUTE_RESULT_TABLE_OPTIONS}
                optionType="button"
                onChange={onTableTypeChange}
                style={{ marginBottom: 17 }}
              />
            </div>
            <Table
              size="small"
              columns={EXCECUTE_RESULT_TABLE}
              dataSource={tableType === 'nodes' ? nodes : edges}
            />
          </TabPane>
          <TabPane
            key="canvas"
            tab={
              <IconItem
                icon="icon-dianbiantupu"
                name="点边图视"
                style={{ marginLeft: -5, height: 'calc(100% - 42px)' }}
              />
            }
          >
            <div className={`canvas`} style={{ height: '100%' }}>
              <GraphCanvas
                data={dealFormatData(formatData) || {}}
                layout={currentLayout}
                getGraphCanvasContextValue={getGraphCanvasContextValue}
                style={{ backgroundColor: '#fff' }}
              />
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-tool-layout`]}>
                <GraphCanvasTools />
                <GraphCanvasLayout
                  currentLayout={currentLayout}
                  onLayoutChange={onLayoutChange}
                />
              </div>
            </div>
            <SwitchDrawer
              visible={visible}
              onShow={onShow}
              onClose={onClose}
              position="right"
              width={516}
              footer={
                <>
                  <Button
                    style={{ marginRight: 12 }}
                    onClick={() => {
                      if (!formDisable) {
                        setState((draft) => {
                          draft.formDisable = true;
                        });
                      }
                    }}
                  >
                    {formDisable ? '删除' : '取消'}
                  </Button>
                  <Button
                    onClick={() => {
                      if (formDisable) {
                        setState((draft) => {
                          draft.formDisable = false;
                        });
                      }
                    }}
                  >
                    {formDisable ? '编辑' : '保存'}
                  </Button>
                </>
              }
            >
              {id ? (
                <>
                  <div className={styles[`${PUBLIC_PERFIX_CLASS}-title`]}>
                    <span>{`${
                      activeElementType === 'node' ? '点' : '边'
                    }ID：${id}`}</span>
                    <Tag>{tagName}</Tag>
                  </div>
                  <Form
                    className={styles[`${PUBLIC_PERFIX_CLASS}-form`]}
                    disabled={formDisable}
                    layout="vertical"
                  >
                    {map(properties, (value, name) => {
                      return (
                        <Form.Item
                          label={
                            <>
                              <div>{name}</div>
                              <Tooltip title="复制">
                                <IconFont
                                  type="icon-fuzhi1"
                                  className={
                                    styles[`${PUBLIC_PERFIX_CLASS}-icon-copy`]
                                  }
                                  onClick={() => {
                                    copy(name);
                                  }}
                                />
                              </Tooltip>
                            </>
                          }
                          name={name}
                          initialValue={value}
                        >
                          <Input />
                        </Form.Item>
                      );
                    })}
                  </Form>
                </>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </SwitchDrawer>
          </TabPane>
        </Tabs>
      </div>
    </GraphCanvasContext.Provider>
  );
};

export default ExecuteResult;
