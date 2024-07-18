import IconFont from '@/components/icon-font';
import { getId } from '@/utils/common';
import { renderer } from '@antv/g6-extension-3d';
import { Select, SelectProps, Space } from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import React from 'react';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
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
    value: 'G6_3D_CANVAS',
    label: (
      <Space>
        <IconFont
          type="icon-GI-3D"
          style={{ fontSize: 18, marginTop: 5 }}
        ></IconFont>
        <span style={{ fontSize: 14 }}>3D 图谱视图</span>
      </Space>
    ),
    disabled: true,
  },
];

const ViewSelect: React.FC<SelectProps> = (props) => {
  const { value } = props;
  const { graph: prevGraph } = useSchemaGraphContext();
  const onChange = (value: string, option: any) => {
    if (value === 'G6_3D_CANVAS') {
      const container = getId();
      prevGraph?.setOptions({
        ...prevGraph.getOptions(),
        container,
        renderer,
        node: {
          type: 'sphere',
        },
        edge: {
          type: 'line3d',
        },
        plugins: [
          {
            type: 'camera-setting',
            projectionMode: 'orthographic',
            near: 1,
            far: 10000,
            fov: 45,
            aspect: 1,
          },
          {
            type: '3d-light',
            directional: {
              direction: [0, 0, 1],
            },
          },
          {
            type: 'background',
            backgroundImage:
              'url(https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*M_OaRrzIZOEAAAAAAAAAAAAADmJ7AQ/original)',
            backgroundPosition: 'center',
          },
        ],
        behaviors: ['observe-canvas-3d', 'zoom-canvas-3d'],
      });
    }
    props.onChange?.(value, option);
  };
  return (
    <div className={styles['view-select']}>
      <Select
        {...props}
        onChange={onChange}
        value={value || 'G6_2D_CANVAS'}
        options={viewModeOptions}
        style={{ width: 'auto' }}
        bordered={false}
      />
    </div>
  );
};

export default ViewSelect;
