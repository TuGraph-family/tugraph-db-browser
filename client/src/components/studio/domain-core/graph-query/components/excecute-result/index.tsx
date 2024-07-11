import { GraphinContextType, Layout, Utils } from '@antv/graphin';
import {
  AutoComplete,
  Button,
  Drawer,
  Empty,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tabs,
  Tag,
  Tooltip,
} from 'antd';
import copy from 'copy-to-clipboard';
import JSONBig from 'json-bigint';
import { cloneDeep, filter, find, isEmpty, map, omit, uniqBy } from 'lodash';
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
import { PROPERTY_TYPE, PUBLIC_PERFIX_CLASS } from '../../../../constant';
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

import { useGraphData } from '../../../../hooks/useGraphData';
import { GraphData, SchemaProperties } from '../../../../interface/schema';
import { editEdgeParamsTransform } from '../../utils/editEdgeParamsTransform';
import styles from './index.module.less';
import { convertIntToNumber } from '@/translator';

const { TabPane } = Tabs;
const { Group } = Radio;

interface ResultProps {
  excecuteResult?: ExcecuteResultProp;
  graphData?: GraphData;
  graphName?: string;
  modalOpen?: boolean;
  onClose?: () => void;
}

const ExecuteResult: React.FC<ResultProps> = ({
  excecuteResult,
  graphData,
  graphName,
  modalOpen,
  onClose: onCancel,
}) => {
  const {
    onCreateEdge,
    onCreateNode,
    onDeleteEdge,
    onDeleteNode,
    onEditEdge,
    onEditNode,
    EditEdgeLoading,
    EditNodeLoading,
    CreateEdgeLoading,
    CreateNodeLoading,
  } = useGraphData();
  const { originalData, formatData } = excecuteResult?.data || {};
  const { visible, onShow, onClose } = useVisible({ defaultVisible: false });
  const { nodes = [], edges = [] } = formatData || {};
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
    propertyTypes: Array<Record<string, string | boolean | any>>;
    editEdgeParams: EditEdge;
    selectType: 'node' | 'edge';
    selectProperties: Array<SchemaProperties>;
    sourceProperity: Array<FormatDataNodeProp>;
    targetProperity: Array<FormatDataNodeProp>;
    sourcePrimaryKey: string;
    targetPrimaryKey: string;
    currentData?: any;
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
    propertyTypes: [],
    editEdgeParams: {},
    selectType: 'node',
    selectProperties: [],
    sourceProperity: nodes,
    targetProperity: nodes,
    sourcePrimaryKey: '',
    targetPrimaryKey: '',
    currentData: {},
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
    propertyTypes,
    editEdgeParams,
    selectType,
    selectProperties,
    sourceProperity,
    targetProperity,
    sourcePrimaryKey,
    targetPrimaryKey,
    currentData,
  } = state;
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();
  const onTableTypeChange = (e: any) => {
    setState(draft => {
      draft.tableType = e.target.value;
    });
  };
  const onLayoutChange = useCallback((layout: Layout) => {
    setState(draft => {
      draft.currentLayout = { ...layout };
    });
  }, []);
  const getGraphCanvasContextValue = useCallback((contextValue: any) => {
    setState(draft => {
      if (contextValue) {
        draft.graphCanvasContextValue = contextValue;
      }
    });
  }, []);

  useEffect(() => {
    if (excecuteResult?.success) {
      const canvasContainer = document.querySelector(`.canvas`);
      const objResizeObserver = new ResizeObserver(entries => {
        window.requestAnimationFrame(() => {
          if (!Array.isArray(entries) || !entries.length) {
            return;
          }
          entries.forEach(entry => {
            const cr = entry.contentRect;
            if (!graphCanvasContextValue?.graph?.destroyed) {
              graphCanvasContextValue.graph.changeSize(cr.width, cr.height);
              graphCanvasContextValue.graph.fitCenter();
            }
          });
        });
      });
      if (canvasContainer) {
        objResizeObserver.observe(canvasContainer);
      }
      graphCanvasContextValue.graph?.on('node:click', val => {
        setState(draft => {
          draft.id = val.item._cfg.id;
          draft.tagName = val.item._cfg.model.label;
          draft.activeElementType = val.item._cfg.type;
          draft.properties = { ...val.item._cfg.model.properties };
          draft.propertyTypes = find(
            graphData.nodes,
            node => node.labelName === val.item._cfg.model.label,
          )?.properties;
          form.setFieldsValue({ ...val.item._cfg.model.properties });
          onShow();
        });
      });
      graphCanvasContextValue.graph?.on('edge:click', val => {
        setState(draft => {
          draft.id = val.item._cfg.id;
          draft.tagName = val.item._cfg.model.label;
          draft.activeElementType = val.item._cfg.type;
          draft.properties = { ...val.item._cfg.model.properties };
          form.setFieldsValue({ ...val.item._cfg.model.properties });
          draft.propertyTypes = find(
            graphData.nodes,
            node => node.labelName === tagName,
          )?.properties;
          const sourceTargetParams = editEdgeParamsTransform(
            val.item._cfg.source._cfg.model,
            val.item._cfg.target._cfg.model,
            graphData.nodes,
          );
          draft.editEdgeParams = {
            graphName,
            labelName: val.item._cfg.model.label,
            ...sourceTargetParams,
          };
          onShow();
        });
      });
      graphCanvasContextValue.apis?.handleAutoZoom();
      return () => {
        if (canvasContainer) {
          objResizeObserver.unobserve(canvasContainer);
        }
      };
    }
  }, [graphCanvasContextValue]);
  useEffect(() => {
    if (formatData) {
      setState(draft => {
        draft.activeKey = 'canvas';
        draft.sourceProperity = nodes;
        draft.targetProperity = nodes;
        draft.currentData = cloneDeep(formatData);
      });
      graphCanvasContextValue.apis?.handleAutoZoom();
    }
  }, [excecuteResult]);
  const dealFormatData = (formatData: {
    nodes: Array<FormatDataNodeProp>;
    edges: Array<FormatDataEdgeProp>;
  }) => {
  
    const newNodes = map(formatData?.nodes, item => ({
      ...item,
      style: { label: { value: item.properties?.name || item.label } },
    }));
    const newEdge = map(formatData?.edges, item => ({
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
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-script`]}>
      <Tooltip title="复制">
        <IconFont
          type="icon-fuzhi1"
          className={styles[`${PUBLIC_PERFIX_CLASS}-icon-copy`]}
          onClick={() => {
            copy(excecuteResult?.script || '');
            message.success('复制成功');
          }}
        />
      </Tooltip>
      <span style={{ marginLeft: 22 }}> {excecuteResult?.script}</span>
    </div>
  );
  const dealGraphData = data => {
    return {
      nodes: data.nodes,
      edges: Utils.processEdges(dealFormatData(data).edges, {
        poly: 50,
        loop: 10,
      }),
    };
  };
  const editNode = () => {
    form.validateFields().then(val => {
      const primaryKey = find(
        graphData?.nodes,
        node => node.labelName === tagName,
      )?.primaryField;
      onEditNode({
        graphName,
        primaryKey,
        primaryValue: properties[primaryKey],
        properties: { ...val },
        labelName: tagName,
      }).then(res => {
        if (res.success) {
          message.success('编辑成功');
          setState(draft => {
            draft.formDisable = true;
          });
          onClose();
        } else {
          message.error(res.errorMessage + '编辑失败');
        }
      });
    });
  };
  const editEdge = () => {
    form.validateFields().then(val => {
      const primaryKey = find(
        graphData?.nodes,
        node => node.labelName === tagName,
      )?.primaryField;
      onEditEdge({ ...editEdgeParams, properties: { ...val } }).then(res => {
        if (res.success) {
          message.success('编辑成功');
          setState(draft => {
            draft.formDisable = true;
          });
          onClose();
        } else {
          message.error(res.errorMessage + '编辑失败');
        }
      });
    });
  };
  const createNode = () => {
    addForm.validateFields().then(val => {
      const { labelName, properties } = val;
      const data = {
        ...currentData,
        nodes: [
          ...(currentData?.nodes || []),
          { id: `${new Date().getTime()}`, label: labelName, properties },
        ],
      };
      setState(draft => {
        draft.currentData = cloneDeep(data);
      });
      onCreateNode({
        graphName,
        labelName,
        properties: { ...properties },
      }).then(res => {
        if (res.success) {
          message.success('插入点类型成功');
          graphCanvasContextValue?.graph?.read(
            dealGraphData(dealFormatData(data)),
          );
          onCancel?.();
          graphCanvasContextValue?.graph?.updateLayout({
            type: 'graphin-force',
            animation: false,
          });
        } else {
          message.error('插入点类型失败' + res.errorMessage);
        }
      });
    });
  };
  const createEdge = () => {
    addForm.validateFields().then(val => {
      const {
        labelName,
        properties,
        source,
        target,
        sourceProperity,
        targetProperity,
      } = val;
      const sourceNode = find(
        graphData?.nodes,
        item => item.labelName === source,
      );
      const targetNode = find(
        graphData?.nodes,
        item => item.labelName === target,
      );
      const sourcePrimaryKey = sourceNode?.primaryField;
      const targetPrimaryKey = targetNode?.primaryField;
      const params = {
        graphName,
        labelName,
        properties,
        sourceValue: sourceProperity,
        targetValue: targetProperity,
        sourcePrimaryKey,
        targetPrimaryKey,
        sourceLabel: source,
        targetLabel: target,
      };
      const data = {
        ...currentData,
        edges: [
          ...(currentData?.edges || []),
          {
            id: `${new Date().getTime()}`,
            label: labelName,
            source: find(nodes, node => node.label === source)?.id,
            target: find(nodes, node => node.label === target)?.id,
            direction: 'OUT',
            properties,
          },
        ],
      };
      setState(draft => {
        draft.currentData = cloneDeep(data);
      });
      onCreateEdge({ ...params }).then(res => {
        if (res.success) {
          message.success('插入边类型成功');
          graphCanvasContextValue?.graph?.read(
            dealGraphData(dealFormatData(data)),
          );
          onCancel?.();
          graphCanvasContextValue?.graph?.updateLayout({
            type: 'graphin-force',
            animation: false,
          });
        } else {
          message.error('插入边类型失败' + res.errorMessage);
        }
      });
    });
  };
  const deleteNode = () => {
    const primaryKey = find(
      graphData?.nodes,
      node => node.labelName === tagName,
    )?.primaryField;
    const data = {
      ...currentData,
      nodes: filter(currentData?.nodes, item => item.id !== id),
    };
    setState(draft => {
      draft.currentData = cloneDeep(data);
    });
    onDeleteNode({
      labelName: tagName,
      graphName,
      primaryKey,
      primaryValue: properties[primaryKey],
    }).then(res => {
      if (res.success) {
        message.success('删除成功');
        onClose();
        graphCanvasContextValue?.graph?.read(
          dealGraphData(dealFormatData(data)),
        );
        graphCanvasContextValue?.graph?.updateLayout({
          type: 'graphin-force',
          animation: false,
        });
      } else {
        message.error('删除失败' + res.errorMessage);
      }
    });
  };
  const deleteEdge = () => {
    const data = {
      ...currentData,
      edges: filter(currentData?.edges, item => item.id !== id),
    };
    setState(draft => {
      draft.currentData = cloneDeep(data);
    });
    onDeleteEdge({ ...editEdgeParams }).then(res => {
      if (res.success) {
        message.success('删除成功');
        onClose();
        graphCanvasContextValue?.graph?.read(
          dealGraphData(dealFormatData(data)),
        );
        graphCanvasContextValue?.graph?.updateLayout({
          type: 'graphin-force',
          animation: false,
        });
      } else {
        message.error('删除失败' + res.errorMessage);
      }
    });
  };
  const columns = [
    {
      key: 'name',
      dataIndex: 'name',
      title: '属性列表',
      width: '30%',
    },
    {
      key: 'value',
      title: '表字段名',
      render: (text, { name, type, optional }) => {
        return (
          <>
            {PROPERTY_TYPE[type] === 'boolean' && (
              <Form.Item
                name={['properties', name]}
                rules={[{ required: !optional, message: `${name}为必填项` }]}
              >
                <Select>
                  <Select.Option value={true}>是</Select.Option>
                  <Select.Option value={false}>否</Select.Option>
                </Select>
              </Form.Item>
            )}
            {PROPERTY_TYPE[type] === 'string' && (
              <Form.Item
                name={['properties', name]}
                rules={[{ required: !optional, message: `${name}为必填项` }]}
              >
                <Input />
              </Form.Item>
            )}
            {PROPERTY_TYPE[type] === 'number' && (
              <Form.Item
                name={['properties', name]}
                rules={[{ required: !optional, message: `${name}为必填项` }]}
              >
                <InputNumber />
              </Form.Item>
            )}
          </>
        );
      },
    },
  ];

  const IDResultPanel = () => {
    return (
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
          form={form}
        >
          {map(properties, (value, name) => {
            const property = find(propertyTypes, item => item.name === name);
            if (PROPERTY_TYPE[property?.type] === 'boolean') {
              return (
                <Form.Item
                  label={
                    <>
                      <div>{name}</div>
                      <Tooltip title="复制">
                        <IconFont
                          type="icon-fuzhi1"
                          className={styles[`${PUBLIC_PERFIX_CLASS}-icon-copy`]}
                          onClick={() => {
                            copy(form.getFieldValue(name));
                          }}
                        />
                      </Tooltip>
                    </>
                  }
                  key={name}
                  name={name}
                  rules={[
                    {
                      required: !property?.optional,
                      message: `${name}是必填项`,
                    },
                  ]}
                  required={false}
                >
                  <Select disabled={formDisable}>
                    <Select.Option value={true}>是</Select.Option>
                    <Select.Option value={false}>否</Select.Option>
                  </Select>
                </Form.Item>
              );
            }
            if (PROPERTY_TYPE[property?.type] === 'number') {
              return (
                <Form.Item
                  label={
                    <>
                      <div>{name}</div>
                      <Tooltip title="复制">
                        <IconFont
                          type="icon-fuzhi1"
                          className={styles[`${PUBLIC_PERFIX_CLASS}-icon-copy`]}
                          onClick={() => {
                            copy(form.getFieldValue(name));
                          }}
                        />
                      </Tooltip>
                    </>
                  }
                  key={name}
                  name={name}
                  rules={[
                    {
                      required: !property?.optional,
                      message: `${name}是必填项`,
                    },
                  ]}
                  required={false}
                >
                  <InputNumber disabled={formDisable} />
                </Form.Item>
              );
            }
            return (
              <Form.Item
                label={
                  <>
                    <div>{name}</div>
                    <Tooltip title="复制">
                      <IconFont
                        type="icon-fuzhi1"
                        className={styles[`${PUBLIC_PERFIX_CLASS}-icon-copy`]}
                        onClick={() => {
                          copy(form.getFieldValue(name));
                        }}
                      />
                    </Tooltip>
                  </>
                }
                name={name}
                key={name}
                rules={[
                  {
                    required: !property?.optional,
                    message: `${name}是必填项`,
                  },
                ]}
                required={false}
              >
                <Input disabled={formDisable} />
              </Form.Item>
            );
          })}
        </Form>
      </>
    );
  };

  // 表格
  const renderJSONTable = () => {
    if (isEmpty(originalData)) {
      return <Empty description="no records" image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    const keys = Object.keys(originalData?.[0]);
    const columns = keys.map(item => {
      return {
        key: item,
        title: item,
        dataIndex: item,
        width: 300,
        render: (value: any) => {
          return (
            <pre
              style={{
                whiteSpace: 'break-spaces',
                wordWrap: 'break-word',
                wordBreak: 'break-word',
              }}
            >
              {typeof value === 'object'
                ? JSONBig.stringify(value, null, 2)
                : value}
            </pre>
          );
        },
      };
    });
    return (
      <Table columns={columns} dataSource={convertIntToNumber(originalData)} />
    );
  };

  return (
    <GraphCanvasContext.Provider value={{ ...graphCanvasContextValue }}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-excecute-result`]}>
        <Tabs
          type="card"
          tabPosition="left"
          activeKey={activeKey}
          style={{
            height: '100%',
          }}
          onChange={val => {
            setState(draft => {
              draft.activeKey = val;
            });
          }}
        >
          {/* <TabPane
            key="JSON"
            tab={<IconItem icon="icon-read" name="JSON视图" />}
          >
            {copyScript}
            <ReactJSONView
              src={
                isEmpty(originalData)
                  ? omit(excecuteResult, 'id')
                  : convertIntToNumber(originalData)
              }
              displayDataTypes={false}
            />
          </TabPane> */}
          <TabPane
            key="JSONText"
            tab={
              <IconItem
                icon="icon-JSONwenben"
                name="表格文本"
                style={{ marginLeft: -5 }}
              />
            }
          >
            {copyScript}
            {renderJSONTable()}
          </TabPane>
          {/* <TabPane
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
          </TabPane> */}
          <TabPane
            key="canvas"
            tab={
              <IconItem
                icon="icon-dianbiantupu"
                name="点边视图"
                style={{ marginLeft: -5 }}
              />
            }
          >
            {copyScript}
            <div className={`canvas`} style={{ height: '100%' }}>
              <GraphCanvas
                key={excecuteResult?.id}
                data={dealGraphData(dealFormatData(formatData)) || {}}
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
                        setState(draft => {
                          draft.formDisable = true;
                        });
                      }
                    }}
                  >
                    {formDisable ? (
                      <Popconfirm
                        title="确定要删除吗？"
                        onConfirm={
                          activeElementType === 'node' ? deleteNode : deleteEdge
                        }
                      >
                        删除
                      </Popconfirm>
                    ) : (
                      '取消'
                    )}
                  </Button>
                  <Button
                    loading={
                      activeElementType === 'node'
                        ? EditNodeLoading
                        : EditEdgeLoading
                    }
                    onClick={() => {
                      if (formDisable) {
                        setState(draft => {
                          draft.formDisable = false;
                        });
                      } else {
                        if (activeElementType === 'node') {
                          editNode();
                        } else {
                          editEdge();
                        }
                      }
                    }}
                  >
                    {formDisable ? '编辑' : '保存'}
                  </Button>
                </>
              }
            >
              {id ? (
                <IDResultPanel />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )}
            </SwitchDrawer>
          </TabPane>
        </Tabs>
        <Drawer
          visible={modalOpen}
          onClose={onCancel}
          maskStyle={{ visibility: 'hidden' }}
          width={520}
          title="插入数据"
          placement="right"
          footer={
            <div>
              <Button onClick={onCancel}> 取消</Button>
              <Button
                type="primary"
                loading={
                  selectType === 'node' ? CreateNodeLoading : CreateEdgeLoading
                }
                onClick={selectType === 'node' ? createNode : createEdge}
              >
                确定
              </Button>
            </div>
          }
        >
          <Form
            form={addForm}
            layout="vertical"
            className={styles[`${PUBLIC_PERFIX_CLASS}-add-modal`]}
          >
            <Form.Item label="选择点/边" required>
              <Input.Group compact>
                <Form.Item
                  className={styles[`${PUBLIC_PERFIX_CLASS}-add-modal-type`]}
                >
                  <Select
                    defaultValue={'node'}
                    onChange={val => {
                      setState(draft => {
                        draft.selectType = val;
                      });
                    }}
                  >
                    <Select.Option value="node">点类型</Select.Option>
                    <Select.Option value="edge">边类型</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="labelName"
                  className={
                    styles[`${PUBLIC_PERFIX_CLASS}-add-modal-labelName`]
                  }
                >
                  <Select
                    className={
                      styles[`${PUBLIC_PERFIX_CLASS}-add-modal-select`]
                    }
                    onChange={val => {
                      setState(draft => {
                        draft.selectProperties = find(
                          graphData[`${selectType}s`],
                          item => item.labelName === val,
                        )?.properties;
                      });
                    }}
                  >
                    {map(
                      selectType === 'node'
                        ? graphData?.nodes
                        : graphData?.edges,
                      item => (
                        <Select.Option
                          key={`options-${item.labelName}`}
                          value={item.labelName}
                        >
                          {item.labelName}
                        </Select.Option>
                      ),
                    )}
                  </Select>
                </Form.Item>
              </Input.Group>
            </Form.Item>
            {selectType === 'edge' && (
              <>
                <Form.Item
                  label="选择起点"
                  className={
                    styles[`${PUBLIC_PERFIX_CLASS}-add-modal-source-name`]
                  }
                  required
                >
                  <Input.Group compact>
                    <Form.Item name="source">
                      <AutoComplete
                        placeholder="请选择起点类型"
                        onChange={val => {
                          setState(draft => {
                            draft.sourceProperity = filter(
                              nodes,
                              item => item.label.indexOf(val) !== -1,
                            );
                            draft.sourcePrimaryKey = find(
                              graphData.nodes,
                              item => item.labelName === val,
                            )?.primaryField;
                          });
                        }}
                        options={map(uniqBy(nodes, 'label'), item => ({
                          value: item.label,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name="sourceProperity"
                      className={
                        styles[`${PUBLIC_PERFIX_CLASS}-add-modal-source-value`]
                      }
                    >
                      <AutoComplete
                        placeholder="请输入起点值"
                        options={map(sourceProperity, item => ({
                          value: item.properties[sourcePrimaryKey],
                        }))}
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
                <Form.Item
                  label="选择终点"
                  required
                  className={
                    styles[`${PUBLIC_PERFIX_CLASS}-add-modal-target-name`]
                  }
                >
                  <Input.Group compact>
                    <Form.Item name="target">
                      <AutoComplete
                        placeholder="请选择终点类型"
                        onChange={val => {
                          setState(draft => {
                            draft.targetProperity = filter(
                              nodes,
                              item => item.label.indexOf(val) !== -1,
                            );
                            draft.targetPrimaryKey = find(
                              graphData?.nodes,
                              item => item.labelName === val,
                            )?.primaryField;
                          });
                        }}
                        options={map(uniqBy(nodes, 'label'), item => ({
                          value: item.label,
                        }))}
                      />
                    </Form.Item>
                    <Form.Item
                      name="targetProperity"
                      className={
                        styles[`${PUBLIC_PERFIX_CLASS}-add-modal-target-value`]
                      }
                    >
                      <AutoComplete
                        placeholder="请输终点值"
                        options={map(targetProperity, item => ({
                          value: item.properties[targetPrimaryKey],
                        }))}
                      />
                    </Form.Item>
                  </Input.Group>
                </Form.Item>
              </>
            )}
            <p>输入数据</p>
            <Table
              columns={columns}
              pagination={false}
              bordered
              dataSource={selectProperties}
            />
          </Form>
        </Drawer>
      </div>
    </GraphCanvasContext.Provider>
  );
};

export default ExecuteResult;
