import { GraphinContextType, Utils } from '@antv/graphin';
import { message } from 'antd';
import { join } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import {
  GraphCanvasContext,
  GraphCanvasContextInitValue,
} from '@/components/studio/components/garph-canvas';
import TextTabs from '@/components/studio/components/text-tabs';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';
import { useSchema } from '@/components/studio/hooks/useSchema';
import { nodesEdgesListTranslator } from '@/components/studio/utils/nodesEdgesListTranslator';
import { MODEL_OVER_VIEW_TABS } from '@/components/studio/domain-core/graph-query/constant';
import EdgeNodeList from './components/edge-node-list';
import GraphCanvasMini from './components/graph-canvas-mini';

import { GraphConfigData } from '@/components/studio/interface/schema';
import styles from './index.module.less';

type ModelOverviewProps = {
  open?: boolean;
  height?: string | number;
  width?: string | number;
  graphName?: string;
};
const ModelOverview: React.FC<ModelOverviewProps> = ({
  open,
  height,
  width,
  graphName,
}) => {
  const [viewState, setViewState] = useImmer<{
    graphCanvasContextValue: GraphinContextType;
    isNodeTab: boolean;
    keyword: string;
    activeTab: 'list' | 'graph' | string;
    graphData: GraphConfigData;
  }>({
    graphCanvasContextValue: GraphCanvasContextInitValue,
    isNodeTab: true,
    keyword: '',
    activeTab: 'list',
    graphData: { nodes: [], edges: [] },
  });
  const { isNodeTab, keyword, activeTab, graphCanvasContextValue, graphData } =
    viewState;
  const { onGetGraphSchema } = useSchema();
  const dealEdges = (edges: Array<any>) => {
    return Utils.processEdges([...edges], { poly: 50, loop: 10 });
  };
  const onSearchChange = (keyword: string) => {
    setViewState(draft => {
      draft.keyword = keyword;
    });
  };
  useEffect(() => {
    if (graphName) {
      onGetGraphSchema({ graphName }).then(res => {
        if (res.success) {
          setViewState(draft => {
            draft.graphData = res.data;
          });
        } else {
          message.error('请求失败' + res.errorMessage);
        }
      });
    }
  }, []);
  const onSegmentedChange = (e: 'node' | 'edge') => {
    setViewState(draft => {
      draft.isNodeTab = e === 'node';
    });
  };

  const getGraphCanvasContextValue = useCallback(
    (contextValue: { graph: any; apis: any; theme: any; layout: any }) => {
      setViewState(draft => {
        if (contextValue) {
          draft.graphCanvasContextValue = contextValue;
        }
      });
    },
    [],
  );

  useEffect(() => {
    const canvasContainer = document.querySelector(
      `.${PUBLIC_PERFIX_CLASS}-view-graph-model-canvas`,
    );
    const objResizeObserver = new ResizeObserver(entries => {
      entries.forEach(entry => {
        const cr = entry.contentRect;
        if (cr && !graphCanvasContextValue?.graph?.destroyed) {
          graphCanvasContextValue.graph.changeSize(cr.width, cr.height);
          graphCanvasContextValue.graph.fitCenter();
          graphCanvasContextValue.graph.fitView();
        }
      });
    });
    if (canvasContainer) {
      objResizeObserver.observe(canvasContainer);
    }
    return () => {
      if (canvasContainer) {
        objResizeObserver.unobserve(canvasContainer);
      }
    };
  }, [graphCanvasContextValue]);

  return (
    <div
      className={join(
        [
          styles[`${PUBLIC_PERFIX_CLASS}-model-overview`],
          open ? styles[`${PUBLIC_PERFIX_CLASS}-model-overview__open`] : '',
        ],
        ' ',
      )}
      style={{ height, width }}
    >
      <GraphCanvasContext.Provider value={{ ...graphCanvasContextValue }}>
        <TextTabs
          type="card"
          tabs={MODEL_OVER_VIEW_TABS}
          onChange={e => {
            setViewState(draft => {
              draft.activeTab = e;
            });
          }}
          activeTab={activeTab}
        />
        <div
          className={styles[`${PUBLIC_PERFIX_CLASS}-model-overview-content`]}
        >
          {activeTab === 'list' && (
            <EdgeNodeList
              onSearchChange={onSearchChange}
              onSegmentedChange={onSegmentedChange}
              isNodeTab={isNodeTab}
              keyword={keyword}
              graphData={graphData}
              width={width as number}
            />
          )}
          {activeTab !== 'list' && (
            <GraphCanvasMini
              getGraphCanvasContextValue={getGraphCanvasContextValue}
              graphData={{
                nodes: nodesEdgesListTranslator('node', graphData),
                edges: dealEdges(nodesEdgesListTranslator('edge', graphData)),
              }}
              graphCanvasContextValue={graphCanvasContextValue}
            />
          )}
        </div>
      </GraphCanvasContext.Provider>
    </div>
  );
};

export default ModelOverview;
