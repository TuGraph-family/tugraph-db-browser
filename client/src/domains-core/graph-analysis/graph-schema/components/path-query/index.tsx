import IconFont from '@/components/icon-font';
import PathChart from '@/domains-core/graph-analysis/graph-schema/components/path-chart';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container/';
import { PathQueryDataSource } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { resetGraphActiveStatus } from '@/domains-core/graph-analysis/graph-schema/utils/reset-graph-active-status/';
import { setGraphActiveStatus } from '@/domains-core/graph-analysis/graph-schema/utils/set-graph-active-status';
import { parseSearch } from '@/utils/parseSearch';
import { useRequest } from 'ahooks';
import type { RadioChangeEvent } from 'antd';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  List,
  Segmented,
  Select,
  Space,
  Spin,
} from 'antd';
import type { SegmentedValue } from 'antd/lib/segmented';
import { omit } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useSearchParams } from 'umi';
import { useImmer } from 'use-immer';
import styles from './index.less';

const PathQuery: React.FC = () => {
  const { graphProjectInfo, graphEngineType, graphSchema } =
    useSchemaFormValue();
  const { tabContainerField, setTabContainerGraphData } =
    useSchemaTabContainer();
  const { graph } = useSchemaGraphContext();
  const { graphId, env } = parseSearch(location.search);
  const [state, setState] = useImmer<{
    hasClear: boolean;
    currentShowType: SegmentedValue;
    originDataSource: PathQueryDataSource[];
    currentPath: PathQueryDataSource | undefined;
    activeStatus: string;
    edgeMaxHop: number | undefined;
  }>({
    hasClear: true,
    currentShowType: 'shortest',
    originDataSource: [],
    currentPath: undefined,
    activeStatus: 'INACTIVE',
    edgeMaxHop: undefined,
  });
  const {
    hasClear,
    currentShowType,
    originDataSource,
    currentPath,
    activeStatus,
    edgeMaxHop,
  } = state;
  const { isSubGraph, isOnlineMode } = graphProjectInfo;
  const [form] = Form.useForm();
  const [, setSearchParams] = useSearchParams();
  const { startId, endId, startIdLabel, endIdLabel, depth } = parseSearch(
    location.search,
  );
  const maxDepth =
    graphEngineType === 'geamaker_geabase' ? edgeMaxHop || 100 : 100;
  // Todo: by Allen
  const { run: runGetShortestPath, loading: loadingGetShortestPath } =
    useRequest(async () => {}, { manual: true });
  // Todo: by Allen
  const { run: runQueryEdgeMaxHop } = useRequest(async () => {}, {
    manual: true,
  });
  const onClearDrawChange = (e: RadioChangeEvent) => {
    setState(draft => {
      draft.hasClear = e.target.checked;
    });
  };
  const onSegmentedChange = (e: SegmentedValue) => {
    setState(draft => {
      draft.currentShowType = e;
    });
  };
  const { nodeOptions } = useMemo(() => {
    return {
      nodeOptions: graphSchema?.nodes?.map(item => ({
        label: item.nodeType,
        value: item.nodeType,
      })),
    };
  }, [graphSchema]);
  const onQuery = () => {
    form.validateFields().then(values => {
      // setSearchParams({
      //   ...parseSearch(location.search),
      //   ...values,
      // });

      tabContainerField.setComponentProps({
        spinning: true,
      });

      // runGetShortestPath().then((data) => {
      //   if (data) {
      //     const { pathData } = data;
      //     if (pathData && pathData.length) {
      //       setState((draft) => {
      //         draft.originDataSource = pathData;
      //       });

      //       if (hasClear) {
      //         graph?.setData(data as GraphData);
      //       } else {
      //         // 在画布上叠加数据
      //         const originData = graph?.getData();
      //         const newData = mergeGraphData(originData, data);
      //         graph?.setData(newData);
      //       }
      //     } else {
      //       setState((draft) => {
      //         draft.originDataSource = [];
      //       });

      //       message.warn('未查询到符合条件的节点');
      //     }
      //     tabContainerField.setComponentProps({
      //       spinning: false,
      //     });
      //   }
      // });
    });
  };
  const shortestDataSource = useMemo(() => {
    if (!originDataSource?.length) {
      return [];
    }
    if (currentShowType === 'shortest') {
      const shortestNodesLength = originDataSource[0]?.graphData?.nodes?.length;
      return originDataSource.filter(
        item => item?.graphData?.nodes?.length === shortestNodesLength,
      );
    } else return originDataSource;
  }, [originDataSource, currentShowType]);
  const handleReset = () => {
    form.resetFields();
    resetGraphActiveStatus(graph);
    const recordParams = parseSearch(location.search);
    setSearchParams({
      ...omit(recordParams, [
        'startId',
        'endId',
        'depth',
        'startIdLabel',
        'endIdLabel',
      ]),
    } as unknown as URLSearchParams);
  };
  const onCheckPath = (pathItem: PathQueryDataSource) => {
    handleReset();
    const { edgeIds, graphData, path } = pathItem;
    const { nodes } = graphData;
    const isCurrentPath = currentPath?.path === path;
    const isActive = activeStatus === 'ACTIVE';
    if ((isCurrentPath && !isActive) || !isCurrentPath) {
      setGraphActiveStatus({
        graph,
        nodes: nodes as any[],
        edges: edgeIds,
      });
      setState(draft => {
        draft.activeStatus = 'ACTIVE';
      });
    } else {
      resetGraphActiveStatus(graph);
      setState(draft => {
        draft.activeStatus = 'INACTIVE';
      });
    }
    setState(draft => {
      draft.currentPath = pathItem;
    });
  };
  const onChangeStartEnd = () => {
    form.setFieldsValue({
      startId: form.getFieldValue('endId'),
      endId: form.getFieldValue('startId'),
    });
  };
  useEffect(() => {
    if (startId && endId) {
      form.setFieldsValue({
        startId,
        endId,
        endIdLabel,
        startIdLabel,
        depth,
      });
    }
  }, [startId, endId]);
  useEffect(() => {
    if (isOnlineMode) {
      // runQueryEdgeMaxHop({ graphId, env }).then((data) => {
      //   if (data)
      //     setState((draft) => {
      //       draft.edgeMaxHop = data;
      //     });
      // });
    }
  }, [isOnlineMode]);
  return (
    <div className={styles['path-query-container']}>
      <div className={styles['content-container']}>
        <Form
          form={form}
          layout="vertical"
          style={{ height: '100%', overflow: 'auto' }}
        >
          <span>路径配置</span>
          <div className={styles['form-container']}>
            <div className={styles['form-container-left']}>
              <div className={styles['form-container-left-icon']}>
                <div className={styles['form-container-left-start-icon']} />
                <IconFont
                  type="icon-lujingchaxun-qiehuan"
                  style={{ fontSize: 20 }}
                  onClick={onChangeStartEnd}
                />
                <div className={styles['form-container-left-end-icon']} />
              </div>
              <div className={styles['form-container-left-line']} />
            </div>
            <div className={styles['form-container-right']}>
              <Form.Item
                name="startId"
                rules={[{ required: true, message: '请输入' }]}
              >
                <Input placeholder="请输入起点" />
              </Form.Item>
              <Form.Item
                name="endId"
                rules={[{ required: true, message: '请输入' }]}
                style={{ marginBottom: 0 }}
              >
                <Input placeholder="请输入终点" />
              </Form.Item>
            </div>
          </div>
          {isSubGraph && (
            <Form.Item
              name="startIdLabel"
              label="起点节点类型"
              rules={[{ required: true, message: '请输入起点类型' }]}
            >
              <Select options={nodeOptions} placeholder="请选择起点节点类型" />
            </Form.Item>
          )}
          {isSubGraph && (
            <Form.Item
              name="endIdLabel"
              label="终点节点类型"
              rules={[{ required: true, message: '请输入起点类型' }]}
            >
              <Select options={nodeOptions} placeholder="请选择终点节点类型" />
            </Form.Item>
          )}
          <Form.Item
            label="最大深度"
            name="depth"
            initialValue={5}
            rules={[
              { required: true, message: `请输入最大深度（上限${maxDepth}）` },
              {
                type: 'number',
                max: maxDepth,
                min: 2,
                message: `最大深度范围2-${maxDepth}`,
              },
            ]}
          >
            <InputNumber
              placeholder={`请输入最大深度（上限${maxDepth}）`}
              style={{ width: '100%' }}
              min={2}
              max={maxDepth}
            />
          </Form.Item>
          <Checkbox checked={hasClear} onChange={onClearDrawChange}>
            清空画布数据
          </Checkbox>
        </Form>
      </div>
      <div className={styles['button-container']}>
        <Space>
          <Button onClick={handleReset}>重置</Button>
          <Button
            className={styles['query-button']}
            loading={loadingGetShortestPath}
            type="primary"
            onClick={onQuery}
          >
            查询
          </Button>
        </Space>
      </div>
      {shortestDataSource?.length ? (
        <div className={styles['content-container']}>
          <Spin spinning={loadingGetShortestPath}>
            <div className={styles['result-title']}>
              <span>查询结果</span>
              <Segmented
                size="small"
                defaultValue={currentShowType}
                options={[
                  { label: '最短', value: 'shortest' },
                  { label: '全部', value: 'all' },
                ]}
                onChange={onSegmentedChange}
              />
            </div>
            <List
              itemLayout="vertical"
              size="small"
              pagination={{
                pageSize: 10,
                size: 'small',
              }}
              dataSource={shortestDataSource}
              renderItem={item => (
                <List.Item
                  key={item.index}
                  className={[
                    styles['path-item'],
                    currentPath?.index === item.index &&
                    activeStatus === 'ACTIVE'
                      ? styles['path-item-active']
                      : '',
                  ].join(' ')}
                  onClick={() => {
                    onCheckPath(item);
                  }}
                >
                  <Space>
                    <IconFont type="icon-zhediemianban-shouqi" rotate={90} />
                    <span>{`路径 ${item.index}`}</span>
                  </Space>
                  <PathChart
                    data={item.graphData}
                    height={item.contentHeight}
                    id={`${item.index}-g6graph`}
                  />
                </List.Item>
              )}
            />
            <div style={{ height: 30 }} />
          </Spin>
        </div>
      ) : null}
    </div>
  );
};
export default PathQuery;
