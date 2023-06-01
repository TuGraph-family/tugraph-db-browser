import { ArrowLeftOutlined, UploadOutlined } from '@ant-design/icons';
import { EdgeConfig, NodeConfig } from '@antv/g6-pc';
import { GraphinContextType, Layout, Utils } from '@antv/graphin';
import type { UploadProps } from 'antd';
import { Button, Checkbox, Modal, Select, Steps, Upload, message } from 'antd';
import { filter, isEmpty } from 'lodash';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'umi';
import { useImmer } from 'use-immer';
import {
  GraphCanvas,
  GraphCanvasContext,
  GraphCanvasContextInitValue,
} from '../../components/garph-canvas';
import { GraphCanvasLayout } from '../../components/graph-canvas-layout';
import { CANVAS_LAYOUT } from '../../components/graph-canvas-layout/constant';
import { GraphCanvasTools } from '../../components/graph-canvas-tools';
import IconFont from '../../components/icon-font';
import { GRAPH_OPERATE, PUBLIC_PERFIX_CLASS } from '../../constant';
import { useImport } from '../../hooks/useImport';
import { useSchema } from '../../hooks/useSchema';
import { SubGraph } from '../../interface/graph';
import { PluginPorps } from '../../interface/openpiece';
import {
  GraphConfigData,
  LabelSchema,
  LabelType,
  SchemaProperties,
} from '../../interface/schema';
import { getLocalData } from '../../utils/localStorage';
import { nodesEdgesListTranslator } from '../../utils/nodesEdgesListTranslator';
import { schemaTransform } from '../../utils/schemaTransform';
import { AddNodesEdges } from './add-nodes-edges';
import { EditNodesEdges } from './edit-nodes-edges';
import { ImportData } from './import-data';
import NodesEdgesList from './nodes-edges-list';

import { downloadFile } from '../../utils/downloadFile';
import styles from './index.module.less';

export const GraphConstruct = (props: PluginPorps) => {
  const redirectPath = props?.redirectPath;
  const history = useHistory();
  const location = history.location;
  const graphList = getLocalData('TUGRAPH_SUBGRAPH_LIST') as SubGraph[];
  const { onImportGraphSchema, ImportGraphSchemaLoading } = useImport();
  const [state, setState] = useImmer<{
    graphListOptions: { label: string; value: string }[];
    currentGraphName: string;
    currentLayout: Layout;
    activeElementValues?: EdgeConfig | NodeConfig;
    graphCanvasContextValue: GraphinContextType;
    activeElementType: LabelType;
    btnType: LabelType;
    activeBtnType: string;
    data: GraphConfigData;
    layouting: boolean;
    labelName: string;
    currentStep: number;
    isActiveItem: boolean;
    onEditShow: () => void;
    onEditClose: () => void;
    onAddShow: () => void;
    onAddClose: () => void;
    onImportShow: () => void;
    onImportClose: () => void;
    isModelOpen: boolean;
    override: boolean;
    schema: Array<{
      label?: string;
      primary?: string;
      type?: string;
      properties?: Array<SchemaProperties>;
    }>;
  }>({
    graphListOptions: graphList?.map((graph: SubGraph) => {
      return {
        label: graph.graph_name,
        value: graph.graph_name,
      };
    }),
    currentGraphName: location?.query?.graphName as string,
    currentLayout: CANVAS_LAYOUT[0].layout,
    activeElementType: 'node',
    graphCanvasContextValue: GraphCanvasContextInitValue,
    btnType: 'node',
    activeBtnType: 'node',
    data: { nodes: [], edges: [] },
    layouting: false,
    labelName: '',
    currentStep: 0,
    isActiveItem: true,
    onEditShow: () => {},
    onEditClose: () => {},
    onAddShow: () => {},
    onAddClose: () => {},
    onImportShow: () => {},
    onImportClose: () => {},
    isModelOpen: false,
    override: false,
    schema: [],
  });
  const {
    currentGraphName,
    graphListOptions,
    currentLayout,
    graphCanvasContextValue,
    btnType,
    activeBtnType,
    data,
    labelName,
    activeElementType,
    currentStep,
    isActiveItem,
    onEditShow,
    onEditClose,
    onAddShow,
    onAddClose,
    onImportShow,
    onImportClose,
    isModelOpen,
    override,
    schema,
  } = state;

  const { onGetGraphSchema, onCreateLabelSchema, onDeleteLabelSchema } =
    useSchema();
  const getGraphCanvasContextValue = useCallback((contextValue: any) => {
    setState((draft) => {
      if (contextValue) {
        draft.graphCanvasContextValue = contextValue;
      }
    });
  }, []);
  const getGraphSchema = (graphName) => {
    onGetGraphSchema({ graphName }).then((res) => {
      if (res.success) {
        setState((draft) => {
          draft.data = res.data;
        });
      }
    });
  };

  useEffect(() => {
    getGraphSchema(currentGraphName);
  }, []);

  useEffect(() => {
    if (currentStep === 1) {
      onAddClose();
      onEditClose();
    } else {
      onImportClose();
    }
  }, [currentStep]);

  useEffect(() => {
    if (data.nodes?.length || data.edges?.length) {
      onAddClose?.();
      setState((draft) => {
        draft.activeBtnType = '';
      });
    } else {
      setState((draft) => {
        draft.activeBtnType = 'node';
      });
    }
  }, [data]);

  const onLayoutChange = useCallback(
    (layout: Layout) => {
      if (data.edges.length || data.nodes.length) {
        setState((draft) => {
          draft.layouting = true;
        });
      }
      setTimeout(() => {
        setState((draft) => {
          draft.currentLayout = layout;
        });
      });
    },
    [graphCanvasContextValue]
  );
  const dealEdges = (edges: Array<any>) => {
    return Utils.processEdges([...edges], { poly: 50, loop: 10 });
  };

  const createLabelSchema = (newSchema) => {
    const labelType = newSchema.labelType;

    let params = {
      graphName: currentGraphName,
      labelType,
      labelName: newSchema.labelName,
      properties: newSchema.properties.map((item) => ({
        name: item.name,
        type: item.type,
        optional: item.optional,
      })),
    } as LabelSchema;
    if (labelType === 'node') {
      if (
        filter(newSchema.indexs, (item) => item.primaryField === true).length >
        1
      ) {
        return message.error('主键必须唯一');
      }
      (params.primaryField = newSchema.indexs.find(
        (item) => item.primaryField === true
      )?.propertyName),
        (params.indexs = newSchema.indexs.map((item) => ({
          propertyName: item?.propertyName,
          isUnique: item?.isUnique,
          labelName: newSchema.labelName,
        })));
    } else {
      params.edgeConstraints = newSchema?.edgeConstraints ?? [];
    }
    if (isEmpty(params.primaryField) && labelType === 'node') {
      return message.error('请设置主键');
    }

    onCreateLabelSchema(params).then((res) => {
      if (res.success) {
        message.success('创建成功');
        window.location.reload();
      } else {
        message.error('创建失败' + res.errorMessage);
      }
    });
  };

  const header = (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-header`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-headerLeft`]}>
        <ArrowLeftOutlined
          onClick={() => {
            history.push(redirectPath?.[0]?.path ?? '/');
          }}
        />
        <Select
          onChange={(value) => {
            window.location.href = `${location.pathname}?graphName=${value}`;
          }}
          defaultValue={currentGraphName}
          options={graphListOptions}
        />
      </div>
      <Steps
        type="navigation"
        current={currentStep}
        className={styles[`${PUBLIC_PERFIX_CLASS}-step`]}
      >
        <Steps.Step title="模型定义" />
        <Steps.Step title="数据导入" />
      </Steps>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-headerRight`]}>
        <Button
          style={{ marginRight: '8px' }}
          onClick={() => {
            history.push(
              `${redirectPath?.[1]?.path}?graphName=${currentGraphName}` ?? '/'
            );
          }}
        >
          前往图查询
        </Button>
        {currentStep === 0 ? (
          <Button
            disabled={isEmpty(data.edges) && isEmpty(data.nodes)}
            onClick={() => {
              setState((draft) => {
                draft.currentStep += 1;
              });
            }}
          >
            下一步
          </Button>
        ) : (
          <Button
            onClick={() => {
              setState((draft) => {
                draft.currentStep -= 1;
              });
            }}
          >
            上一步
          </Button>
        )}
      </div>
    </div>
  );
  const operate = (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-operate`]}>
      {GRAPH_OPERATE.map((item) => (
        <div
          key={item.lable}
          className={[
            styles[`${PUBLIC_PERFIX_CLASS}-operate-item`],
            activeBtnType === item.value
              ? styles[`${PUBLIC_PERFIX_CLASS}-operate-item-active`]
              : '',
          ].join(' ')}
          onClick={() => {
            setState((draft) => {
              if (item.value === 'node' || item.value === 'edge') {
                onAddShow();
                draft.labelName = '';
              }
              draft.btnType = item.value as LabelType;
              draft.activeBtnType = item.value;
              if (item.value === 'import') {
                draft.isModelOpen = true;
              }
              if (item.value === 'export') {
                downloadFile(
                  JSON.stringify(schemaTransform(data)),
                  `${currentGraphName}.json`
                );
                message.success('模型导出成功');
              }
            });
          }}
        >
          <IconFont
            type={item.icon}
            style={{ fontSize: '25px', paddingRight: '5px' }}
          />
          {item.lable}
        </div>
      ))}
    </div>
  );
  useEffect(() => {
    graphCanvasContextValue.graph?.on('click', (val) => {
      onEditShow();
      if (val.shape) {
        setState((draft) => {
          console.log(val);
          draft.activeElementType = val.item._cfg.type;
          draft.labelName = val.item._cfg.model.label;
        });
      } else {
        setState((draft) => {
          draft.isActiveItem = false;
        });
      }
    });
  }, [graphCanvasContextValue, onEditShow]);
  const uploadProps: UploadProps = {
    name: 'file',
    maxCount: 1,
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (result) => {
        setState((draft) => {
          try {
            draft.schema = JSON.parse(result.target.result);
          } catch (e) {
            console.error(e.message);
          }
        });
      };
    },
  };
  return (
    <div
      className={styles[`${PUBLIC_PERFIX_CLASS}-construct`]}
      style={currentStep !== 0 ? { height: '100vh' } : {}}
    >
      {header}
      {currentStep === 0 ? operate : null}
      <NodesEdgesList
        graphName={currentGraphName}
        isActiveItem={isActiveItem}
        onClick={(item, type) => {
          const edgeChildrenList = filter(
            nodesEdgesListTranslator('edge', data),
            (edge) => edge.label === item.labelName
          );
          onEditShow();
          const isEdges = edgeChildrenList.length !== 1 && type === 'edge';
          setState((draft) => {
            draft.activeElementType = type;
            draft.labelName = item.labelName;
            draft.isActiveItem = true;
            let selectedValue;
            if (item.edgeConstraints?.length > 0 || type === 'node') {
              if (isEdges) {
                selectedValue = edgeChildrenList.map((child) => child.id);
              } else {
                if (type === 'node') {
                  selectedValue = item.labelName;
                } else {
                  selectedValue = edgeChildrenList[0]?.id;
                }
              }
              graphCanvasContextValue.graph?.getNodes().forEach((node) => {
                graphCanvasContextValue.graph?.clearItemStates(node);
              });
              graphCanvasContextValue.graph?.getEdges().forEach((node) => {
                graphCanvasContextValue.graph?.clearItemStates(node);
              });
              if (Array.isArray(selectedValue)) {
                selectedValue.forEach((item) => {
                  graphCanvasContextValue.graph.focusItem(item, true);
                  graphCanvasContextValue.graph.setItemState(
                    item,
                    'selected',
                    true
                  );
                });
              } else {
                graphCanvasContextValue.graph.focusItem(selectedValue, true);
                graphCanvasContextValue.graph.setItemState(
                  selectedValue,
                  'selected',
                  true
                );
              }
            }
          });
        }}
        data={data}
        currentStep={currentStep}
        onDelete={(name, type) => {
          onDeleteLabelSchema({
            graphName: currentGraphName,
            labelType: type,
            labelName: name,
          }).then((res) => {
            if (res.success) {
              message.success('删除成功');
              window.location.reload();
            } else {
              message.error('删除失败' + res.errorMessage);
            }
          });
        }}
      />
      <GraphCanvasContext.Provider value={{ ...graphCanvasContextValue }}>
        <div
          className={styles[`${PUBLIC_PERFIX_CLASS}-construct-canvas`]}
          style={currentStep !== 0 ? { height: '100vh' } : {}}
        >
          <GraphCanvas
            data={{
              nodes: nodesEdgesListTranslator('node', data),
              edges: dealEdges(nodesEdgesListTranslator('edge', data)),
            }}
            getGraphCanvasContextValue={getGraphCanvasContextValue}
            layout={currentLayout}
          />
        </div>
        <div
          className={styles[`${PUBLIC_PERFIX_CLASS}-construct-canvas-layout`]}
        >
          <GraphCanvasTools />
          <GraphCanvasLayout
            onLayoutChange={onLayoutChange}
            currentLayout={currentLayout}
          />
        </div>
      </GraphCanvasContext.Provider>
      {currentStep === 0 ? (
        <>
          {labelName ? (
            <EditNodesEdges
              type={activeElementType}
              data={data}
              labelName={labelName}
              currentGraphName={currentGraphName}
              onRefreshSchema={() => {
                getGraphSchema(currentGraphName);
              }}
              onSwitch={(onShow, onClose) => {
                setState((draft) => {
                  draft.onEditShow = onShow;
                  draft.onEditClose = onClose;
                });
              }}
            />
          ) : (
            <AddNodesEdges
              onSwitch={(onShow, onClose) => {
                setState((draft) => {
                  draft.onAddShow = onShow;
                  draft.onAddClose = onClose;
                });
              }}
              type={btnType}
              data={data}
              onFinish={createLabelSchema}
            />
          )}
        </>
      ) : (
        <ImportData
          graphName={currentGraphName}
          onSwitch={(onShow, onClose) => {
            setState((draft) => {
              draft.onImportShow = onShow;
              draft.onImportClose = onClose;
            });
          }}
          activeElementType={activeElementType}
          activeElementLabelName={labelName}
          graphData={data}
          data={data}
          redirectPath={redirectPath}
        />
      )}
      <Modal
        title="导入模型"
        width={480}
        visible={isModelOpen}
        onCancel={() => {
          setState((draft) => {
            draft.isModelOpen = false;
          });
        }}
        confirmLoading={ImportGraphSchemaLoading}
        className={styles[`${PUBLIC_PERFIX_CLASS}-model`]}
        onOk={() => {
          onImportGraphSchema({
            graph: currentGraphName,
            schema,
            override,
          }).then((res) => {
            if (res.success) {
              message.success('导入成功');
              window.location.reload();
              setState((draft) => {
                draft.isModelOpen = false;
              });
            } else {
              message.error('导入失败' + res.errorMessage);
            }
          });
        }}
      >
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-upload`]}>
          <Upload {...uploadProps}>
            <Button type="ghost" shape="round" icon={<UploadOutlined />}>
              上传文件
            </Button>
          </Upload>
        </div>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-model-json`]}>
          支持扩展名：.JSON
        </div>
        <Checkbox
          onChange={(e) => {
            setState((draft) => {
              draft.override = e.target.checked;
            });
          }}
        >
          覆盖当前画布中的模型
        </Checkbox>
      </Modal>
    </div>
  );
};
