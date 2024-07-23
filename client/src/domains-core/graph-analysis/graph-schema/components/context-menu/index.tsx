import { parseSearch } from '@/utils/parseSearch';
import { useRequest } from 'ahooks';
import { CanvasEvent, IElementEvent, NodeEvent } from '@antv/g6';
import { Menu, MenuProps } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value/';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
// import QueryService from '@/domains-core/graph-analysis/graph-schema/services/graph-data';
// import { getStyledGraphData } from '@/domains-core/graph-analysis/graph-schema/utils/get-styled-graph-data';
// import { getUniqGraphData } from '@/domains-core/graph-analysis/graph-schema/utils/get-uniq-graph-data';
import styles from './index.less';
import { useAnalysis } from '@/hooks/useAnalysis';
import { parseHashRouterParams } from '@/utils/parseHash';

interface ContextMenuProps {
  children?: React.ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = () => {
  const { graph } = useSchemaGraphContext();
  const { graphName } = parseHashRouterParams(location.hash);
  const { graphEngineType, graphSchemaStyle } = useSchemaFormValue();
  const {onQueryNeighbors} = useAnalysis()
  const { tabContainerField } = useSchemaTabContainer();
  const [state, updateState] = useImmer<{
    menuStyles: {
      display: 'none' | 'block';
      top: number;
      left: number;
    };
    menuType: 'node' | 'edge';
    menuItems: MenuProps['items'];
    elementId?: string;
  }>({
    menuStyles: {
      display: 'none',
      top: 0,
      left: 0,
    },
    menuType: 'node',
    menuItems: [
      {
        label: '扩展节点',
        key: 'query-neighbor',
        children: [
          { label: '一级节点', key: 'query-neighbor-1' },
          { label: '二级节点', key: 'query-neighbor-2' },
          { label: '三级节点', key: 'query-neighbor-3' },
        ],
      },
      { label: '收起节点', key: 'collapse-node' }, // 菜单项务必填写 key
      { label: '删除节点', key: 'remove-node' },
    ],
  });
  const { menuStyles, menuItems, elementId } = state;
  // Todo: by Allen
  const { run: runQueryNeighbors } = useRequest(async() => {}, {
    manual: true,
  });
  const hideMemu = () => {
    updateState((draft) => {
      draft.menuStyles.display = 'none';
    });
  };
  const onMenuClick = (e: { key: string }) => {
    const { key } = e;
    if (key.includes('query-neighbor')) {
      const sep = Number(key.split('-')[2]);
      const nodeType = graph?.getElementData(elementId!)?.label as string;
      tabContainerField.setComponentProps({
        spinning: true,
      });
      updateState((draft) => {
        draft.menuStyles.display = 'none';
      });
      onQueryNeighbors({
        graphName,
        sep,
        id:elementId
      }).then(res=>console.log(res))


      // runQueryNeighbors({
      //   id: elementId,
      //   sep,
      //   schemaType: nodeType,
      //   graphId,
      //   graphDeployEnvEnum: env,
      //   schemaEngineTypeEnum: graphEngineType,
      // }).then((data) => {
      //   if (data && graph) {
      //     const currentData = graph.getData();
      //     const styledGraphData = getStyledGraphData({
      //       graphSchemaStyle,
      //       graphData: data,
      //     });
      //     const graphData = getUniqGraphData(currentData, styledGraphData);
      //     graph.setData(graphData);
      //     graph.render();
      //   }

      //   tabContainerField.setComponentProps({
      //     spinning: false,
      //   });
      // });
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
