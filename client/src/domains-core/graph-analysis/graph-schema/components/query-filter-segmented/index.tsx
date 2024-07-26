import IconFont from '@/components/icon-font';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { Segmented, SegmentedProps } from 'antd';
import { default as React, useMemo } from 'react';
import styles from './index.less';

interface QueryFilterSegmentedProps extends SegmentedProps {
  activeOptions?: string[];
}
const QUERY_FILTER_OPTIONS = [
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
];

const QueryFilterSegmented: React.FC<QueryFilterSegmentedProps> = ({
  value,
  activeOptions = QUERY_FILTER_OPTIONS.map((item) => item.value),
  ...others
}) => {
  const { setTabContainerValue } = useSchemaTabContainer();
  const onChange = (value: any) => {
    setTabContainerValue(`LeftSiderContent`, value);
    setTabContainerValue(
      `CanvasContainer.CanvasHeader.LayoutStyleSegmented`,
      null,
    );
    others.onChange?.(value);
  };
  const options = useMemo(() => {
    return QUERY_FILTER_OPTIONS.filter((item) =>
      activeOptions?.includes(item.value),
    );
  }, [activeOptions]);

  return activeOptions.length ? (
    <div className={styles['query-filter']}>
      <div className={styles['query-filter-title']}>查询过滤</div>
      <Segmented
        {...others}
        onChange={onChange}
        value={value}
        options={options}
      />
    </div>
  ) : null;
};

export default QueryFilterSegmented;
