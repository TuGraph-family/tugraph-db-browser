import { G2, Histogram } from '@antv/g2plot';
import React, { useEffect } from 'react';
import { StatisticsFilterCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';

interface IHistogramChartProps {
  filterCondition: StatisticsFilterCondition;
  index?: number;
  updateFilterCondition: (filterCondition: StatisticsFilterCondition) => void;
}

const HistogramChart: React.FC<IHistogramChartProps> = (props) => {
  const { filterCondition, index, updateFilterCondition } = props;
  const { histogramData = [{}], histogramOptions } = filterCondition;

  const { min, max, binWidth, isCustom } = histogramOptions || {};

  useEffect(() => {
    G2.registerInteraction('element-highlight', {
      start: [{ trigger: 'element:click', action: 'element-highlight:toggle' }],
    });
  }, []);

  useEffect(() => {
    const binOptions = isCustom
      ? {
          binWidth: binWidth,
          meta: {
            range: {
              min: min,
              max: max,
              nice: true,
            },
            count: {
              nice: true,
            },
          },
        }
      : {
          meta: {
            range: {
              nice: true,
            },
            count: {
              nice: true,
            },
          },
        };

    const histogramPlot = new Histogram(
      `${filterCondition.id}-chart-container-${index}`,
      {
        data: histogramData,
        height: 200,
        binField: 'value',
        color: 'rgba(111, 147, 222, 1)',
        tooltip: {},
        interactions: [{ type: 'element-highlight' }],
        state: {
          // 设置 active 激活状态的样式
          active: {
            style: {
              fill: 'rgba(56, 83, 215, 1)',
              lineWidth: 0,
            },
          },
        },
        ...binOptions,
      },
    );

    histogramPlot.on('element:click', ({ view }: Record<string, any>) => {
      const elements = view.geometries[0].elements;
      const selectRanges = elements
        .filter((e: Record<string, any>) => e.states.indexOf('active') !== -1)
        .map((e: Record<string, any>) => e.data.range);
      const isFilterReady = selectRanges.length !== 0;

      updateFilterCondition({
        ...filterCondition,
        isFilterReady,
        range: selectRanges,
      });
    });

    histogramPlot.render();

    // 初次渲染时，处于筛选范围内的图表元素高亮
    histogramPlot.setState('active', (item: Record<string, any>) => {
      if (!filterCondition.range || !filterCondition.isFilterReady)
        return false;

      for (let arr of filterCondition.range) {
        const min = arr[0];
        const max = arr[1];
        if (item.range[0] === min && item.range[1] === max) {
          return true;
        }
      }
      return false;
    });

    histogramPlot.setState('inactive', (item: Record<string, any>) => {
      if (!filterCondition.range || !filterCondition.isFilterReady)
        return false;
      for (let arr of filterCondition.range) {
        const min = arr[0];
        const max = arr[1];
        if (item.range[0] === min && item.range[1] === max) {
          return false;
        }
      }
      return true;
    });

    return () => {
      histogramPlot.destroy();
    };
  }, [histogramData, min, max, binWidth, isCustom]);

  return <div id={`${filterCondition.id}-chart-container-${index}`} />;
};

export default HistogramChart;
