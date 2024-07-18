import IconFont from '@/components/icon-font';
import { GraphEvent } from '@antv/g6';
import { Popover, Segmented, SegmentedProps } from 'antd';
import type { SegmentedValue } from 'antd/lib/segmented';
import React, { useEffect } from 'react';
import { LAYOUT_CONFIG_LIST } from '@/domains-core/graph-analysis/graph-schema/constants/layout';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { LayoutConfigItem } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import styles from './index.less';

const LayoutStyleSegmented: React.FC<SegmentedProps> = (props) => {
  const { graph } = useSchemaGraphContext();
  const { tabContainerField, setTabContainerValue } = useSchemaTabContainer();
  const PopoverItem = ({ id, src, name, options }: LayoutConfigItem) => {
    return (
      <div
        className={styles['popoverItem']}
        onClick={() => {
          tabContainerField.setComponentProps({
            spinning: true,
          });
          graph?.setLayout(options);
          // show spinning
          setTimeout(() => {
            graph?.layout();
          });
          // 自身值置为布局
          props.onChange?.('LAYOUT');
          // Sider依赖值
          setTabContainerValue(`LeftSiderContent`, id);
          // LayoutForm组件值
          setTabContainerValue(`CanvasContainer.CanvasLeftSider.LayoutForm`, {
            layoutType: id,
          });
          // 清空查询筛选值
          setTabContainerValue(
            `CanvasContainer.CanvasHeader.QueryFilterSegmented`,
            null,
          );
        }}
      >
        <img src={src} className={styles['pic']} />
        <div className={styles['text']}>{name}</div>
      </div>
    );
  };
  const onChange = (value: SegmentedValue) => {
    props.onChange?.(value);
    if (value !== 'LAYOUT') {
      // Sider依赖值
      setTabContainerValue(`LeftSiderContent`, value);
      setTabContainerValue(
        `CanvasContainer.CanvasHeader.QueryFilterSegmented`,
        null,
      );
    }
  };
  useEffect(() => {
    const afterLayout = () => {
      tabContainerField.setComponentProps({
        spinning: false,
      });
      graph?.fitCenter();
    };
    const beforeLayout = () => {
      tabContainerField.setComponentProps({
        spinning: true,
      });
    };
    graph?.on(GraphEvent.AFTER_LAYOUT, afterLayout);
    graph?.on(GraphEvent.BEFORE_LAYOUT, beforeLayout);
    return () => {
      graph?.off(GraphEvent.AFTER_LAYOUT, afterLayout);
      graph?.off(GraphEvent.BEFORE_LAYOUT, beforeLayout);
    };
  }, [graph]);

  return (
    <Segmented
      {...props}
      onChange={onChange}
      options={[
        {
          label: (
            <Popover
              title={null}
              content={
                <div className={styles['popoverContent']}>
                  {LAYOUT_CONFIG_LIST.map((item) => {
                    return <PopoverItem key={item?.id} {...item} />;
                  })}
                </div>
              }
              placement="bottom"
            >
              <IconFont
                type="icon-bujuicon"
                style={{ fontSize: 16, marginRight: 4 }}
              />
              布局
            </Popover>
          ),
          value: 'LAYOUT',
        },
        {
          label: (
            <div>
              <IconFont
                type="icon-waiguanyangshi"
                style={{ fontSize: 16, marginRight: 4 }}
              />
              样式
            </div>
          ),
          value: 'STYLE',
        },
      ]}
    />
  );
};

export default LayoutStyleSegmented;
