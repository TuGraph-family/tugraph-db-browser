import IconFont from '@/components/icon-font';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { renderer } from '@antv/g6-extension-3d';
import { Select, SelectProps, Space } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import React from 'react';
import styles from './index.less';

const viewModeOptions: DefaultOptionType[] = [
  {
    value: 'G6_2D_CANVAS',
    label: (
      <Space>
        <IconFont
          type="icon-tugraph-graph-view"
          style={{ fontSize: 18 }}
        ></IconFont>
        <span style={{ fontSize: 14 }}>2D 图谱视图</span>
      </Space>
    ),
  },
  {
    value: 'TABLE',
    label: (
      <Space>
        <IconFont
          type="icon-liebiaoshituicon"
          style={{ fontSize: 18, marginTop: 5 }}
        ></IconFont>
        <span style={{ fontSize: 14 }}>列表视图</span>
      </Space>
    ),
  },
  {
    value: 'JSON',
    label: (
      <Space>
        <IconFont
          type="icon-JSONshitu1"
          style={{ fontSize: 18, marginTop: 5 }}
        ></IconFont>
        <span style={{ fontSize: 14 }}>JSON 视图</span>
      </Space>
    ),
  },
];

const ViewSelect: React.FC<SelectProps> = props => {
  const { value } = props;
  const onChange = (value: string, option: any) => {
    props.onChange?.(value, option);
  };
  return (
    <div className={styles['view-select']}>
      <Select
        {...props}
        onChange={onChange}
        value={value || 'G6_2D_CANVAS'}
        options={viewModeOptions}
        style={{ minWidth: 130 }}
        bordered={false}
      />
    </div>
  );
};

export default ViewSelect;
