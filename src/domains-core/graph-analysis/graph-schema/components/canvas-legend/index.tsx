import IconFont from '@/components/icon-font';
import CanvasLegendPieChart from '@/domains-core/graph-analysis/graph-schema/components/canvas-legend-pie-chart';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import generateEdgeTypeMap from '@/domains-core/graph-analysis/graph-schema/utils/generate-edge-type-map';
import groupAndCountNodesByLabel from '@/domains-core/graph-analysis/graph-schema/utils/group-and-count-nodes-by-label';
import { cloneDeep } from 'lodash';
import { EdgeData, NodeData } from '@antv/g6';
import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';
import styles from './index.less';

const reg = /\+[^+]+\+/g;
const reg1 = /<[^<]+>/g;

const CanvasLegend: React.FC = () => {
  const { graph } = useSchemaGraphContext();
  const data = graph?.getData() || { nodes: [], edges: [] };
  const copyData = cloneDeep(data);

  const getSetArray = useCallback(
    (arr: NodeData[] | EdgeData[], key = 'id') => {
      const map = new Map();
      if (arr.length) {
        arr.forEach((i: any) => {
          map.set(i[key], i);
        });
        return [...map.values()];
      }
      return [];
    },
    [],
  );

  if (data) {
    copyData.nodes = getSetArray(data.nodes);
    copyData.edges = getSetArray(data.edges);
  }

  const { nodes, edges } = copyData;
  const typeMap: Record<string, any> = {};
  const [state, setState] = useImmer<{
    visible: boolean;
    viewType: string;
    nodeType: string;
  }>({
    visible: false,
    viewType: 'list',
    nodeType: 'nodes',
  });

  const { visible, viewType, nodeType } = state;

  const viewTypeOnChange = (value: string) => {
    setState((draft) => {
      draft.viewType = value;
    });
  };
  if (nodes.length === 0) {
    return null;
  }

  const nodesGroup = groupAndCountNodesByLabel({ nodes, typeMap });

  const onClickType = (type: string) => {
    nodes.forEach((node: Record<string, any>) => {
      const hasMatch = typeMap[type]?.includes(node?.id);
      if (hasMatch) {
        graph?.setElementState(node?.id, 'disabled', false);
        graph?.setElementState(node?.id, 'selected', true);
      } else {
        graph?.setElementState(node?.id, 'selected', false);
        graph?.setElementState(node?.id, 'disabled', true);
      }
    });
  };

  const handleViewCard = () => {
    setState((draft: Record<string, any>) => {
      draft.visible = !visible;
    });
  };

  const PointList = () => {
    return (
      <>
        {nodesGroup.map((item: Record<string, any>) => {
          const num =
            nodes.filter((i: Record<string, any>) => i?.label === item?.label)
              .length || 0;
          return (
            <div className={styles['listItem']} key={item.label}>
              <div className={styles['left']}>
                <div
                  className={styles['icon']}
                  style={{ backgroundColor: item?.style?.fill }}
                ></div>
                <div className={styles['text']}>{item?.label}</div>
              </div>
              <div className={styles['right']}>{num}</div>
            </div>
          );
        })}
      </>
    );
  };

  const EdgesList = () => {
    const edgesData = generateEdgeTypeMap({ nodes, edges });
    return (
      <>
        {[...edgesData.keys()].map((key: string) => {
          let title: string = '';
          let match: RegExpMatchArray | null = key.match(reg);
          if (match && Array.isArray(match)) {
            title = match[0].slice(1, -1);
          }

          let connect: any = '';
          let match1: RegExpMatchArray | null = key.match(reg1);
          if (match1 && Array.isArray(match1)) {
            connect = match1[0].slice(1, -1);
          }
          return (
            <div className={styles['listEdgesItem']} key={key} id={key}>
              <div className={styles['top']}>
                <div className={styles['left']}>
                  <IconFont type="icon-bian1" className={styles['icon']} />
                  <div className={styles['text']}>{title}</div>
                </div>
                <div className={styles['right']}>
                  {edgesData.get(key)?.length || 0}
                </div>
              </div>
              <div className={styles['bottom']}>
                <div className={styles['text']}>{connect.split('=>')[0]}</div>
                <IconFont
                  type="icon-zhixiang"
                  color="#363740"
                  className={styles['icon']}
                />

                <div className={styles['text']}>{connect.split('=>')[1]}</div>
              </div>
            </div>
          );
        })}
      </>
    );
  };

  const listMap: Record<string, JSX.Element> = {
    nodes: <PointList />,
    edges: <EdgesList />,
  };

  const List = () => <div className={styles['list']}>{listMap[nodeType]}</div>;

  const nodeMap: Record<string, JSX.Element> = {
    list: <List />,
    chart: (
      <CanvasLegendPieChart
        nodes={nodes}
        edges={edges}
        typeMap={typeMap}
        viewType={viewType}
        nodeType={nodeType}
      />
    ),
  };

  return (
    <div className={styles['canvasLegend']}>
      {nodesGroup.map((item) => {
        return (
          <div
            key={item.label}
            className={styles['nodesItem']}
            onClick={() => onClickType(item?.label)}
          >
            {/* 圆点 */}
            <div
              className={styles['icon']}
              style={{ backgroundColor: item?.style?.fill }}
            ></div>
            <div className={styles['text']}>{item?.label}</div>
          </div>
        );
      })}
      <div className={styles['openIcon']} onClick={handleViewCard}>
        <IconFont
          type="icon-a-shouqidangqianyizhankai"
          rotate={visible ? 180 : 0}
          className={styles['icon']}
        />
      </div>
      {visible ? (
        <div className={styles['canvasLegendCard']}>
          <div className={styles['type']}>
            <div className={styles['nodeType']}>
              <div
                className={
                  styles[nodeType === 'nodes' ? 'typeActive' : 'typeNormal']
                }
                onClick={() => {
                  setState((pre) => {
                    pre.nodeType = 'nodes';
                  });
                }}
              >
                <span className={styles['text']}>点</span>
                <span className={styles['num']}>{nodes.length || 0}</span>
              </div>
              <div
                className={
                  styles[nodeType === 'edges' ? 'typeActive' : 'typeNormal']
                }
                onClick={() => {
                  setState((pre) => {
                    pre.nodeType = 'edges';
                  });
                }}
              >
                <span className={styles['text']}>边</span>
                <span className={styles['num']}>{edges.length || 0}</span>
              </div>
            </div>
            <div className={styles['viewType']}>
              <div
                className={
                  styles[
                    viewType === 'list' ? 'viewTypeActive' : 'viewTypeNormal'
                  ]
                }
                onClick={() => viewTypeOnChange('list')}
              >
                <IconFont
                  type="icon-tufenxi-tuli-liebiaoshitu"
                  className={styles['icon']}
                />
              </div>
              <div
                className={
                  styles[
                    viewType === 'chart' ? 'viewTypeActive' : 'viewTypeNormal'
                  ]
                }
                onClick={() => viewTypeOnChange('chart')}
              >
                <IconFont
                  type="icon-tufenxi-tuli-tubiaoshitu"
                  className={styles['icon']}
                />
              </div>
            </div>
          </div>
          {nodeMap[viewType]}
        </div>
      ) : null}
    </div>
  );
};

export default CanvasLegend;
