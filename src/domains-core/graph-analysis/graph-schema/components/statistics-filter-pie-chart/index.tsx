import { Pie } from '@antv/g2plot';
import React, { useEffect } from 'react';
import { StatisticsFilterCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';

interface IPieChartProps {
  filterCondition: StatisticsFilterCondition;
  updateFilterCondition: (filterCondition: StatisticsFilterCondition) => void;
  index?: number;
  //chartData: Map<string, number>;
}

const PieChart: React.FC<IPieChartProps> = (props) => {
  const { filterCondition, index, updateFilterCondition } = props;
  const { chartData = new Map() } = filterCondition;

  useEffect(() => {
    const sum = [...chartData.values()].reduce((acc, cur) => acc + cur, 0);
    const data = [...chartData.entries()].map((e) => {
      const [key, value] = e;
      return {
        x: key,
        value,
      };
    });

    const piePlot = new Pie(`${filterCondition.id}-chart-container-${index}`, {
      height: 200,
      data,
      angleField: 'value',
      colorField: 'x',
      radius: 0.9,
      label: {
        type: 'inner',
        offset: '-30%',
        content: ({ value }) => `${((value / sum) * 100).toFixed(0)}%`,
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
    });

    piePlot.render();

    piePlot.on('element:click', ({ view }: Record<string, any>) => {
      const elements = view.geometries[0].elements;
      const selectValue = elements
        .filter((e: Record<string, any>) => e.states.indexOf('selected') !== -1)
        .map((e: Record<string, any>) => e.data.x);
      const isFilterReady = selectValue.length !== 0;
      updateFilterCondition({
        ...filterCondition,
        isFilterReady,
        selectValue,
      });
    });

    piePlot.setState('selected', (item: Record<string, any>) => {
      return (
        !!filterCondition.selectValue &&
        filterCondition.selectValue.indexOf(item.x) !== -1
      );
    });

    return () => {
      piePlot.destroy();
    };
  }, [chartData]);

  return <div id={`${filterCondition.id}-chart-container-${index}`} />;
};

export default PieChart;
