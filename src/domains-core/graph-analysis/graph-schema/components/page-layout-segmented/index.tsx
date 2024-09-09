import { Segmented, SegmentedProps } from 'antd';
import type { SegmentedValue } from 'antd/lib/segmented';
import React from 'react';

const PageLayoutSegmented: React.FC<SegmentedProps> = (props) => {
  const onChange = (value: SegmentedValue) => {
    props.onChange?.(value);
  };

  return (
    <Segmented
      value={props.value}
      onChange={onChange}
      options={[
        {
          label: '标签布局',
          value: 'Tab',
        },
        {
          label: '卡片布局',
          value: 'Card',
        },
      ]}
    />
  );
};

export default PageLayoutSegmented;
