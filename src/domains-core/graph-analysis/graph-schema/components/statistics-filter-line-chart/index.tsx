import { Column } from '@antv/g2plot';
import { Select } from 'antd';
import * as React from 'react';

interface LineChartProps {
  source: Record<string, any>;
  filterCondition: Record<string, any>;
  width: number;
  elementProps: Record<string, any>;
}

const LineChart: React.FunctionComponent<LineChartProps> = (props) => {
  const PlotRef = React.useRef(null);
  const { source, filterCondition, elementProps } = props;
  const [state, setState] = React.useState({
    yField: '',
  });
  const { elementType } = filterCondition;
  const { yField } = state;

  React.useEffect(() => {
    const data = source[`${elementType}s`]
      .map((c: Record<string, any>) => {
        return c.properties;
      })
      .sort((a: Record<string, any>, b: Record<string, any>) => {
        if (a[filterCondition.prop] < b[filterCondition.prop]) {
          return -1;
        }
        return 1;
      });

    const line = new Column(PlotRef.current as any, {
      data: data,
      padding: 'auto',
      xField: filterCondition.prop,
      yField: yField,
      slider: {},
    });

    line.render();
    return () => {
      line.destroy();
    };
  }, [yField]);
  const onSelectChange = (val: string) => {
    setState((pre) => {
      return {
        ...pre,
        yField: val,
      };
    });
  };

  return (
    <div>
      <Select style={{ width: '80%' }} onChange={onSelectChange}>
        {Object.entries(elementProps).map((e) => {
          const [key] = e;

          return (
            <Select.Option value={key} key={key}>
              {key}
            </Select.Option>
          );
        })}
      </Select>
      <div ref={PlotRef}></div>
    </div>
  );
};

export default LineChart;
