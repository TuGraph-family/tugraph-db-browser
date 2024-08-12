import { filterTitleEllipsis } from '@/utils/filterTitleEllipsis';
import React, { useEffect } from 'react';
import { cloneDeep } from 'lodash';
import G6, { GraphData } from '@antv/g6-4';

interface G6GraphProps {
  data: GraphData;
  id: string;
  height?: number;
}


G6.registerNode(
  'sql',
  {
    drawShape(cfg, group) {
      const rect = group?.addShape('circle', {
        attrs: {
          x: 0,
          y: -20,
          r: 4,
          fill: '#1783FF',
          lineWidth: 1,
        },
        name: 'circle-shape',
      });
      if (cfg?.name) {
        group?.addShape('text', {
          attrs: {
            text: filterTitleEllipsis(cfg.name as string, 50, 12),
            x: 0,
            y: 0,
            fill: '#000',
            fontSize: 12,
            textAlign: 'center',
            textBaseline: 'middle',
            fontWeight: 'normal',
          },
          name: 'text-shape',
        });
      }
      return rect;
    },
  },
  'single-node',
);

/**
 * 路径图
 */
const PathChart: React.FC<G6GraphProps> = ({ data, height, id }) => {
  const container = document.getElementsByClassName('canvas-sider');
  useEffect(() => {
    if (!height || !data) return;
    const width = container?.[0].clientWidth - 120 || 0;
    const graph = new G6.Graph({
      container: id,
      width,
      height,
      animate: true,
      defaultNode: {
        type: 'sql',
      },
      defaultEdge: {
        style: {
          stroke: '#99add1',
        },
      },
      fitCenter: true,
      fitViewPadding: 16,
    });
    graph.updateLayout({
      width: container?.[0].clientWidth - 120,
    });
    graph.data(cloneDeep(data));
    graph.render();
    return () => graph.destroy();
  }, [data, height, id, container?.[0].clientWidth]);
  return <div id={id} style={{ height }} />;
};
export default PathChart;
