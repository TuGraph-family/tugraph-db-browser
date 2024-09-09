import groupAndCountNodesByLabel from '@/domains-core/graph-analysis/graph-schema/utils/group-and-count-nodes-by-label';
import PieChartEdgesTranslator from '@/domains-core/graph-analysis/graph-schema/utils/pie-chart-edges-translator';
import { Pie } from '@antv/g2plot';
import React, { useEffect, useRef } from 'react';
interface Props {
  nodes: Record<string, any>;
  edges: Record<string, any>;
  typeMap: Record<string, any>;
  viewType: string;
  nodeType: string;
}

const CanvasLegendPieChart: React.FC<Props> = ({
  nodes,
  edges,
  typeMap,
  viewType,
  nodeType,
}) => {
  const dataMap: Record<string, any> = {
    nodes: groupAndCountNodesByLabel({ nodes, typeMap }),
    edges: PieChartEdgesTranslator(edges),
  };
  const piePlot = useRef<Pie>();
  const labelMap: Record<string, any> = {
    nodes: {
      angleField: 'num',
      colorField: 'label',
    },
    edges: {
      angleField: 'num',
      colorField: 'label',
    },
  };
  useEffect(() => {
    const config = {
      appendPadding: 0,
      data: dataMap[nodeType],
      ...labelMap[nodeType],
      radius: 0.7,
      autoFit: true,
      height: 200,
      legend: {
        offsetX: -20,
      },
      label: {
        type: 'inner',
        offset: '-30%',
        content: ({ percent }: { percent: number }) =>
          `${(percent * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-active' }],
    };
    if (piePlot.current) {
      piePlot.current?.update(config);
    } else {
      piePlot.current = new Pie('chartContainer', config);
      piePlot.current.render();
    }
  }, [viewType, nodeType]);

  return <div id="chartContainer"></div>;
};

export default CanvasLegendPieChart;
