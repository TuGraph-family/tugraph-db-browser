/**
 * 图分析头部工具栏-画布操作
 */
import IconFont from '@/components/icon-font';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { Button, Segmented } from 'antd';
import type { SegmentedProps, SegmentedValue } from 'antd/lib/segmented';
import { default as React, useMemo } from 'react';
import LassoSelect from '@/domains-core/graph-analysis/graph-schema/components/lasso-select';
import styles from './index.less';

interface CanvasToolbarSegmentedProps extends SegmentedProps {
  activeOptions?: string[];
}

const CanvasToolbarSegmented: React.FC<CanvasToolbarSegmentedProps> = ({
  activeOptions = ['LASSO'],
  ...props
}) => {
  const { setTabContainerGraphData } = useSchemaTabContainer();

  const LAYOUT_STYLE_OPTIONS = [
    {
      label: <LassoSelect />,
      value: 'LASSO',
    },
  ];
  const onChange = (value: SegmentedValue) => {
    props?.onChange?.(value);
  };
  const options = useMemo(() => {
    return LAYOUT_STYLE_OPTIONS.filter((item) =>
      activeOptions?.includes(item.value),
    );
  }, [activeOptions]);

  const onClearCanvas = () => {
    setTabContainerGraphData({
      data: { graphData: {}, originQueryData: [] },
      ifClearGraphData: true,
    });
  };

  return (
    <div className={styles['canvas-toolbar']}>
      <div className={styles['canvas-toolbar-title']}>画布操作</div>
      <Segmented onChange={onChange} options={options} />
      <Button
        onClick={onClearCanvas}
        type="link"
        icon={<IconFont style={{ fontSize: 20 }} type="icon-tugraph-clear" />}
      ></Button>
    </div>
  );
};

export default CanvasToolbarSegmented;
