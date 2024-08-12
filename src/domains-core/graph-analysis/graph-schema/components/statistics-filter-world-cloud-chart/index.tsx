import { WordCloud } from '@antv/g2plot';
import React, { useEffect } from 'react';
import { StatisticsFilterCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';

interface IWordCloudChartProps {
  filterCondition: StatisticsFilterCondition;
  index?: number;
  updateFilterCondition: (filterCondition: StatisticsFilterCondition) => void;
}

const WordCloudChart: React.FC<IWordCloudChartProps> = (props) => {
  const { filterCondition, index, updateFilterCondition } = props;
  const { chartData = new Map() } = filterCondition;

  useEffect(() => {
    const data = [...chartData.entries()].map((e) => {
      const [key, value] = e;
      return {
        x: key,
        value,
        category: '',
      };
    });

    const wordCloud = new WordCloud(
      `${filterCondition.id}-chart-container-${index}`,
      {
        data,
        height: 200,
        wordField: 'x',
        weightField: 'value',
        color: '#122c6a',
        wordStyle: {
          fontFamily: 'Verdana',
          fontSize: [10, 16],
        },
        // 设置交互类型
        interactions: [
          { type: 'element-active' },
          { type: 'element-selected' },
        ],
        state: {
          active: {
            // 这里可以设置 active 时的样式
            style: {
              lineWidth: 3,
            },
          },
        },
      },
    );

    wordCloud.on('element:click', ({ view }: Record<string, any>) => {
      const elements = view.geometries[0].elements;
      const selectValue = elements
        .filter((e: Record<string, any>) => e.states.indexOf('selected') !== -1)
        .map((e: Record<string, any>) => e.data.datum.x);
      const isFilterReady = selectValue.length !== 0;
      updateFilterCondition({
        ...filterCondition,
        isFilterReady,
        selectValue,
      });
    });

    wordCloud.render();

    return () => {
      wordCloud.destroy();
    };
  }, [chartData]);

  return <div id={`${filterCondition.id}-chart-container-${index}`} />;
};
export default WordCloudChart;
