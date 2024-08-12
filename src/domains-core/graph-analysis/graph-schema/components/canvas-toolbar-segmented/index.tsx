/**
 * 图分析头部工具栏-画布操作
 */
import IconFont from '@/components/icon-font';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { Button } from 'antd';
import type { SegmentedProps } from 'antd/lib/segmented';
import { default as React } from 'react';
import styles from './index.less';

interface CanvasToolbarSegmentedProps extends SegmentedProps {
  activeOptions?: string[];
}

const CanvasToolbarSegmented: React.FC<CanvasToolbarSegmentedProps> = ({
  ...props
}) => {
  const { setTabContainerGraphData } = useSchemaTabContainer();

  const onClearCanvas = () => {
    setTabContainerGraphData({
      data: { graphData: {}, originQueryData: [] },
      ifClearGraphData: true,
    });
  };

  return (
    <div className={styles['canvas-toolbar']}>
      <div className={styles['canvas-toolbar-title']}>画布操作</div>
      <Button
        onClick={onClearCanvas}
        type="link"
        icon={<IconFont style={{ fontSize: 20 }} type="icon-tugraph-clear" />}
      ></Button>
    </div>
  );
};

export default CanvasToolbarSegmented;
