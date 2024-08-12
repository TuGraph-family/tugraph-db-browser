import { cloneDeep } from 'lodash';
import { onFieldValueChange } from '@formily/core';
import { useFormEffects } from '@formily/react';
import { Table } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { OriginGraphData } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import styles from './index.less';
import { TooltipText } from '@/components/studio/components/tooltip-text';

const GraphTableView: React.FC = () => {
  const { getTabContainerValue, tabContainerIndex } = useSchemaTabContainer();
  const [state, setState] = useImmer<{ originGraphData: OriginGraphData }>({
    originGraphData: {},
  });
  const { graphData } = state.originGraphData;

  useFormEffects(() => {
    onFieldValueChange(
      `CanvasList.${tabContainerIndex}.originGraphData`,
      (field) => {
        setState((draft) => {
          draft.originGraphData = cloneDeep(field.value);
        });
      },
    );
  });
  useEffect(() => {
    const originGraphData = getTabContainerValue('originGraphData');
    setState((draft) => {
      draft.originGraphData = cloneDeep(originGraphData);
    });
  }, []);

  return (
    <div className={styles['graph-table-view']}>
      <div className={styles.table}>
        <div className={styles['table-title']}>点列表</div>
        <Table
          dataSource={graphData?.nodes}
          columns={[
            { dataIndex: 'id', title: 'ID' },
            { dataIndex: 'label', title: '类型' },
            {
              dataIndex: 'properties',
              title: '属性',
              render: (text) => (
                <TooltipText maxWidth={300} text={JSON.stringify(text)} />
              ),
            },
          ]}
        />
      </div>
      <div className={styles.table}>
        <div className={styles['table-title']}>边列表</div>
        <Table
          dataSource={graphData?.edges}
          columns={[
            { dataIndex: 'id', title: 'ID' },
            { dataIndex: 'label', title: '类型' },
            { dataIndex: 'source', title: '起点 ID' },
            { dataIndex: 'target', title: '终点 ID' },
            {
              dataIndex: 'properties',
              title: '属性',
              render: (text) => (
                <TooltipText maxWidth={300} text={JSON.stringify(text)} />
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default GraphTableView;
