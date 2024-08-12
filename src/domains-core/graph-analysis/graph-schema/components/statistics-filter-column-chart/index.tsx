import { Column, Datum, G2 } from '@antv/g2plot';
import React, { useEffect } from 'react';
import { StatisticsFilterCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';

export interface IColumnChartProps {
  filterCondition: StatisticsFilterCondition;
  index?: number;
  updateFilterCondition: (filterCondition: StatisticsFilterCondition) => void;
  highlightRank?: number;
}

const ColumnChart: React.FC<IColumnChartProps> = (props) => {
  const { filterCondition, index, updateFilterCondition, highlightRank } =
    props;
  const { chartData = new Map(), selectOptions = [] } = filterCondition;

  useEffect(() => {
    G2.registerInteraction('element-highlight', {
      start: [{ trigger: 'element:click', action: 'element-highlight:toggle' }],
    });
  }, []);

  useEffect(() => {
    const dataLength = chartData.size;
    const highlightThreshold =
      highlightRank && highlightRank > dataLength
        ? dataLength - 1
        : highlightRank;
    const data = [...chartData.entries()].map((e, i) => {
      const [key, value] = e;
      const { rank = Infinity, isOutlier = false } = selectOptions[i] || {};
      return {
        x: key,
        y: value,
        highlight:
          highlightThreshold && rank < highlightThreshold ? true : false,
        isOutlier,
      };
    });

    const columnPlot = new Column(
      `${filterCondition.id}-chart-container-${index}`,
      {
        data,
        xField: 'x',
        yField: 'y',
        height: 200,
        seriesField: 'highlight',
        color: ({ highlight }) => {
          if (highlight) return '#eb2f96';
          return 'rgba(111, 147, 222, 1)';
        },
        label: {
          content: ({ highlight, isOutlier, y }) => {
            if (highlight && !isOutlier) return y;
          },
          style: {
            fill: '#eb2f96',
            fontSize: 10,
          },
          offset: 4,
          position: 'top',
        },
        tooltip: {
          fields: ['x', 'y'],
          formatter: (datum: Datum) => {
            return { name: datum.x, value: datum.y };
          },
        },
        interactions: [{ type: 'element-highlight' }],
        state: {
          // 设置 active 激活状态的样式
          active: {
            style: {
              lineWidth: 0,
            },
          },
        },
        legend: false,
      },
    );

    columnPlot.on('element:click', ({ view }: Record<string, any>) => {
      const elements = view.geometries[0].elements;

      const selectValue = elements
        .filter((e: Record<string, any>) => e.states.indexOf('active') !== -1)
        .map((e: Record<string, any>) => e.data.x);

      const isFilterReady = selectValue.length !== 0;
      updateFilterCondition({
        ...filterCondition,
        isFilterReady,
        selectValue,
      });
    });

    columnPlot.render();

    columnPlot.setState('active', (item: Datum) => {
      if (!filterCondition.isFilterReady || !filterCondition.selectValue)
        return false;
      return filterCondition.selectValue.includes(item.x);
    });

    columnPlot.setState('inactive', (item: Datum) => {
      if (!filterCondition.isFilterReady || !filterCondition.selectValue)
        return false;
      return !filterCondition.selectValue.includes(item.x);
    });

    return () => {
      columnPlot.destroy();
    };
  }, [chartData, selectOptions, highlightRank]);

  return <div id={`${filterCondition.id}-chart-container-${index}`} />;
};

export default ColumnChart;
