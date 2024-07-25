import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { registerBreathingNode } from '@/domains-core/graph-analysis/graph-schema/registers/breathing-node/';
import { registerClusterDagreLayout } from '@/domains-core/graph-analysis/graph-schema/registers/cluster-dagre-layout/';
import { getStyledGraphData } from '@/domains-core/graph-analysis/graph-schema/utils/get-styled-graph-data';
import { resizeCanvas } from '@/domains-core/graph-analysis/graph-schema/utils/resize-canvas';
import { getId } from '@/utils';
import { cloneDeep } from 'lodash';
import { Renderer } from '@antv/g-svg';
import {
  CameraSetting,
  EdgeEvent,
  ExtensionCategory,
  Graph,
  GraphData,
  GraphEvent,
  IElementEvent,
  NodeEvent,
  register,
} from '@antv/g6';
import {
  Light,
  Line3D,
  ObserveCanvas3D,
  Sphere,
  ZoomCanvas3D,
} from '@antv/g6-extension-3d';
import { onFieldValueChange } from '@formily/core';
import { useForm, useFormEffects } from '@formily/react';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import styles from './index.less';

registerBreathingNode();
registerClusterDagreLayout();
register(ExtensionCategory.NODE, 'sphere', Sphere);
register(ExtensionCategory.PLUGIN, '3d-light', Light);
register(ExtensionCategory.PLUGIN, 'camera-setting', CameraSetting);
register(ExtensionCategory.EDGE, 'line3d', Line3D);
register(ExtensionCategory.BEHAVIOR, 'zoom-canvas-3d', ZoomCanvas3D);
register(ExtensionCategory.BEHAVIOR, 'observe-canvas-3d', ObserveCanvas3D);

interface GraphCanvasProps {
  children: React.ReactNode;
  value?: any;
  onChange?: (value: any) => void;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  children,
  onChange,
  value,
}) => {
  const form = useForm();
  const { updateContextValue, graph: contextGraph } = useSchemaGraphContext();
  const { tabContainerIndex, tabContainerField, getTabContainerValue } =
    useSchemaTabContainer();
  const { graphSchemaStyle } = useSchemaFormValue();
  const [state, setState] = useImmer<{
    canvasId: string;
    graphData: GraphData;
  }>({
    canvasId: getId(),
    graphData: {},
  });
  useFormEffects(() => {
    onFieldValueChange(
      `CanvasList.${tabContainerIndex}.originGraphData`,
      (field) => {
        setState((draft) => {
          draft.graphData = cloneDeep(field.value?.graphData);
        });
      },
    );
  });

  const containerId = state.canvasId;
  const setElementInfo = (data: any) => {
    form.setValuesIn(
      `CanvasList.${tabContainerIndex}.CanvasContainer.CanvasRightSider.ElementInfo`,
      data,
    );
    form.setValuesIn(
      `CanvasList.${tabContainerIndex}.RightSiderContent`,
      'ELEMENT_INFO',
    );
  };
  useEffect(() => {
    const graphData = getStyledGraphData({
      graphData: { ...state.graphData },
      graphSchemaStyle,
    });
    contextGraph?.setData({ ...graphData });
    contextGraph?.render();
  }, [state.graphData]);

  useEffect(() => {
    tabContainerField.setComponentProps({
      spinning: true,
    });
    const graph = new Graph({
      renderer: () => new Renderer(),
      container: containerId,
      data: { ...value?.graphData },
      behaviors: [
        'zoom-canvas',
        {
          key: 'drag-canvas', //交互 key，即唯一标识
          type: 'drag-canvas',
        },
        'drag-element',
        {
          type: 'hover-activate',
          degree: 1, // 👈🏻 Activate relations.
          state: 'highlight',
        },
      ],
      node: {
        style:{
          labelText: (d) => d.id,
        },
        type: 'breathing-node',
        state: {
          highlight: {
            fill: '#D580FF',
          },
        },
      },
      edge: {
        style: {
          labelBackgroundFill: '#FFF',
          labelBackground: true,
        },
      },
      layout: {
        type: 'force',
        preventOverlap: true,
        animation: false,
      },
    });

    graph.draw().then(() => {
      tabContainerField.setComponentProps({
        spinning: false,
      });
      updateContextValue?.((draft) => {
        draft.graph = graph;
      });
    });

    // 设置当前Tab 激活的元素信息
    const onNodeClick = (e: IElementEvent) => {
      const {
        target: { id },
      } = e;
      const nodeData = graph.getNodeData(id);
      setElementInfo(nodeData);
    };

    const onEdgeClick = (e: IElementEvent) => {
      const {
        target: { id },
      } = e;
      const edgeData = graph.getEdgeData(id);
      setElementInfo(edgeData);
    };
    const onAfterRender = () => {
      onChange?.({ ...value, graphData: { ...graph?.getData() } });
    };

    graph.on(NodeEvent.CLICK, onNodeClick);
    graph.on(EdgeEvent.CLICK, onEdgeClick);
    graph.on(GraphEvent.AFTER_RENDER, onAfterRender);

    return () => {
      graph.off(NodeEvent.CLICK, onNodeClick);
      graph.off(GraphEvent.AFTER_RENDER, onAfterRender);
      graph.off(EdgeEvent.CLICK, onEdgeClick);
    };
  }, []);

  useEffect(() => {
    // 阻止浏览器右键菜单事件
    const canvasDom = document.getElementById(containerId!);
    const preventContextMenuDefaultEvent = (e: MouseEvent) => {
      e.preventDefault();
    };
    if (canvasDom) {
      canvasDom.addEventListener('contextmenu', preventContextMenuDefaultEvent);
    }

    return () => {
      canvasDom?.removeEventListener(
        'contextmenu',
        preventContextMenuDefaultEvent,
      );
    };
  }, [containerId]);

  // 从卡片切回标签，强制渲染后，canvas高度为0，需要监听dom变化重置
  useEffect(() => {
    const targetElement = document.getElementById(containerId);
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width && height) {
          setTimeout(() => {
            resizeCanvas({ graph: contextGraph });
          });
        }
      }
    });
    if (targetElement) {
      resizeObserver.observe(targetElement);
    }
    return () => {
      if (targetElement) {
        resizeObserver.unobserve(targetElement);
      }
    };
  }, [contextGraph]);
  useEffect(() => {
    const originGraphData = getTabContainerValue('originGraphData');
    if (originGraphData?.graphData) {
      setState((draft) => {
        draft.graphData = cloneDeep(originGraphData.graphData);
      });
    }
  }, []);

  return (
    <div className={[styles['graph-canvas'], 'graph-canvas'].join(' ')}>
      {children}
      <div id={containerId} style={{ height: '100%', width: '100%' }} />
    </div>
  );
};

export default GraphCanvas;
