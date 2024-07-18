import { Segmented, SegmentedProps } from 'antd';
import React from 'react';
import styles from './index.less';

const QuerySegmentedOptions = [
  {
    label: '配置查询',
    value: 'CONFIG_QUERY',
  },
  {
    label: '语句查询',
    value: 'LANGUAGE_QUERY',
  },
  {
    label: '路径查询',
    value: 'PATH_QUERY',
  },
  // {
  //   label: '模版查询',
  //   value: 'TEMPLATE_QUERY',
  // },
];

const QuerySegmented: React.FC<SegmentedProps> = (props) => {
  return (
    <div className={styles['query-segmented']}>
      <Segmented
        {...props}
        value={props.value || 'CONFIG_QUERY'}
        options={QuerySegmentedOptions}
      />
    </div>
  );
};

export default QuerySegmented;
