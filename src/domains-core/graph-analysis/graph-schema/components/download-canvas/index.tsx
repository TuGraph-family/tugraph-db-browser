import IconFont from '@/components/icon-font';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { downLoadJson } from '@/domains-core/graph-analysis/graph-schema/utils/download-json';
import { downloadFullImage } from '@/domains-core/graph-analysis/graph-schema/utils/download-png';
import { Dropdown, Menu } from 'antd';
import { memo } from 'react';
import styles from './index.less';

const DownloadCanvans = () => {
  const { getTabContainerValue } = useSchemaTabContainer();
  const { graph } = useSchemaGraphContext();

  const MENU_CONFIG = [
    {
      key: 'download',
      type: 'download',
      label: '下载图分析',
      children: [
        {
          key: 'PNG',
          label: 'PNG',
        },
        {
          key: 'JSON',
          label: 'JSON',
        },
        {
          key: 'CSV',
          label: 'CSV',
          disabled: true,
        },
      ],
    },
  ];

  const onDownload = (val: string) => {
    const originGraphData = getTabContainerValue('originGraphData');
    if (!originGraphData?.graphData?.nodes?.length) return;
    if (val === 'PNG') {
      downloadFullImage(graph!);
    }
    if (val === 'JSON') {
      downLoadJson(originGraphData.graphData);
    }
  };

  return (
    <Dropdown.Button
      trigger={['click']}
      className={styles['download']}
      overlay={
        <Menu onClick={({ key }) => onDownload(key)} items={MENU_CONFIG} />
      }
      icon={<IconFont type="icon-down" />}
    >
      保存结果
    </Dropdown.Button>
  );
};

export default memo(DownloadCanvans);
