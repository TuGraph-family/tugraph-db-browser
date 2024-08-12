import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { useAnalysis } from '@/hooks/useAnalysis';
import { parseHashRouterParams } from '@/utils/parseHash';
import { CanvasEvent, IElementEvent, NodeEvent } from '@antv/g6';
import { Menu, MenuProps } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import styles from './index.less';

interface ContextMenuProps {
  children?: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = () => {
  const { graph } = useSchemaGraphContext();
  const { graphName } = parseHashRouterParams(location.hash);
  const { onQueryNeighbors } = useAnalysis();
  const { tabContainerField, setTabContainerGraphData } =
    useSchemaTabContainer();
  const [state, updateState] = useImmer<{
    menuStyles: {
      display: 'none' | 'block';
      top: number;
      left: number;
    };
    menuType: 'node' | 'edge';
    foldedNodes: string[];
    elementId?: string;
  }>({
    menuStyles: {
      display: 'none',
      top: 0,
      left: 0,
    },
    menuType: 'node',
    foldedNodes: [],
  });
  const { menuStyles, elementId, foldedNodes } = state;

  const menuItems: MenuProps['items'] = useMemo(() => {
    const model = graph?.getNodeData(elementId!);
    return [
      {
        label: '扩展节点',
        key: 'query-neighbor',
        children: [
          { label: '一级节点', key: 'query-neighbor-1' },
          { label: '二级节点', key: 'query-neighbor-2' },
          { label: '三级节点', key: 'query-neighbor-3' },
        ],
      },
      { label: model?.folded ? '展开节点' : '收起节点', key: 'collapse-node' }, // 菜单项务必填写 key
      { label: '删除节点', key: 'remove-node' },
    ];
  }, [foldedNodes, elementId]);

  const setFoldedNodes = (val: string[]) => {
    updateState((draft) => {
      draft.foldedNodes = val;
    });
  };


  const hideMemu = () => {
    updateState((draft) => {
      draft.menuStyles.display = 'none';
    });
  };
  const onMenuClick = (e: { key: string }) => {
    const { key } = e;
    if (key.includes('query-neighbor')) {
      const sep = Number(key.split('-')[2]);
      tabContainerField.setComponentProps({
        spinning: true,
      });
      updateState((draft) => {
        draft.menuStyles.display = 'none';
      });
      onQueryNeighbors({
        graphName,
        sep,
        id: elementId,
      }).then(res => {
        setTabContainerGraphData({
          data: {
            graphData: res?.formatData,
            originQueryData: res?.originalData,
          },
          ifClearGraphData: false,
        });
        tabContainerField.setComponentProps({
          spinning: false,
        });
      });
    } else if (key.includes('collapse-node')) {
      const model = graph?.getNodeData(elementId!);
      const neighborNode = graph?.getNeighborNodesData(elementId!);
      const neighborEdge = graph?.getRelatedEdgesData(elementId!);
      const hideNodeIds: string[] = [];
      const notHideNodeIds: string[] = [];
      neighborNode?.forEach((item) => {
        if (graph?.getNeighborNodesData(item.id!).length === 1) {
          hideNodeIds.push(item.id);
        } else {
          notHideNodeIds.push(item.id);
        }
      });
      const hideOrShowElement = (id: string) => {
        if (model?.folded) {
          graph?.showElement(id);
          setFoldedNodes([...foldedNodes, id]);
        } else {
          graph?.hideElement(id);
          setFoldedNodes(foldedNodes.filter((item) => item !== id));
        }
      };

      hideNodeIds.forEach((item) => hideOrShowElement(item));
      neighborEdge?.forEach((item) => {
        if (!notHideNodeIds.some((nodeId) => item.id?.includes(nodeId))) {
          hideOrShowElement(item.id!);
        }
      });
      graph?.updateData({
        nodes: [
          {
            ...model!,
            folded: !model?.folded,
          },
        ],
      });
      hideMemu();
    } else if (key === 'remove-node') {
      if (elementId) {
        graph?.removeData({ nodes: [elementId] });
        graph?.draw();
        hideMemu();
      }
    }
  };

  useEffect(() => {
    const onContextMenu = (e: IElementEvent) => {
      const {
        target: { config },
      } = e;
      const clientRect = graph
        ?.getCanvas()
        .getContainer()!
        .getBoundingClientRect();
      if (clientRect && config.id) {
        updateState((draft) => {
          draft.menuStyles.left = e.client.x - clientRect.left + 20;
          draft.menuStyles.top = e.client.y - clientRect.top;
          draft.menuStyles.display = 'block';
          draft.elementId = config.id;
        });
      }
    };
    if (graph) {
      graph.on(NodeEvent.CONTEXT_MENU, onContextMenu);
      graph.on(CanvasEvent.CLICK, hideMemu);
    }
    return () => {
      if (graph) {
        graph.off(NodeEvent.CONTEXT_MENU, onContextMenu);
        graph.off(CanvasEvent.CLICK, hideMemu);
      }
    };
  }, [graph]);
  return menuStyles.display === 'block' ? (
    <div style={menuStyles} className={styles['context-menu']}>
      <Menu
        items={menuItems}
        triggerSubMenuAction="hover"
        onClick={onMenuClick}
      />
    </div>
  ) : null;
};

export default ContextMenu;
