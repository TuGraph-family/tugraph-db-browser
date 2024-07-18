import IconFont from '@/components/icon-font';
import { Segmented, SegmentedProps } from 'antd';
import React from 'react';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';

const QueryFilterSegmented: React.FC<SegmentedProps> = (props) => {
  const { setTabContainerValue } = useSchemaTabContainer();
  const onChange = (value: any) => {
    setTabContainerValue(`LeftSiderContent`, value);
    setTabContainerValue(
      `CanvasContainer.CanvasHeader.LayoutStyleSegmented`,
      null,
    );
    props.onChange?.(value);
  };

  return (
    <Segmented
      {...props}
      onChange={onChange}
      value={props.value}
      options={[
        {
          label: (
            <div>
              <IconFont
                type="icon-query-color"
                style={{ fontSize: 16, marginRight: 4 }}
              />
              查询
            </div>
          ),
          value: 'QUERY',
        },
        {
          label: (
            <div>
              <IconFont
                type="icon-filter-color"
                style={{ fontSize: 16, marginRight: 4 }}
              />
              筛选
            </div>
          ),
          value: 'FILTER',
        },
      ]}
    />
  );
};

export default QueryFilterSegmented;
