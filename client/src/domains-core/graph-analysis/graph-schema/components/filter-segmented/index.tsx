import { Segmented, SegmentedProps } from 'antd';
import React from 'react';
import styles from './index.less';

const FilterSegmentedOptions = [
  {
    label: '属性筛选',
    value: 'ATTRIBUTES_FILTER',
  },
  {
    label: '统计筛选',
    value: 'STATISTICS_FILTER',
  },
];

const FilterSegmented: React.FC<SegmentedProps> = (props) => {
  return (
    <div className={styles['filter-segmented']}>
      <Segmented {...props} options={FilterSegmentedOptions} />
    </div>
  );
};

export default FilterSegmented;
