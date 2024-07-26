import IconFont from '@/components/icon-font';
import FilterSelection from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter-form';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value/';
import {
  StatisticsFilterCondition,
  StatisticsFilterConditionHistogramOpt,
} from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { filterGraphData } from '@/domains-core/graph-analysis/graph-schema/utils/filter-graph-data';
import { highlightSubGraph } from '@/domains-core/graph-analysis/graph-schema/utils/highlight-sub-graph';
import { uniqueElementsBy } from '@/domains-core/graph-analysis/graph-schema/utils/unique-elements-by/';
import { CloseOutlined } from '@ant-design/icons';
import { GraphData } from '@antv/g6';
import { Button, Form, Popconfirm } from 'antd';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import styles from './index.less';

export interface StatisticsFilterProps {
  histogramOptions?: StatisticsFilterConditionHistogramOpt;
}

const StatisticsFilter: React.FC<StatisticsFilterProps> = ({
  histogramOptions,
}) => {
  const id = nanoid();
  const { graph } = useSchemaGraphContext();
  const { graphSchema } = useSchemaFormValue();

  const [form] = Form.useForm();
  const [filterdata, setFilterData] = useState<
    Record<string, StatisticsFilterCondition>
  >({
    [id]: {
      defaultKey: undefined,
      histogramOptions: undefined,
      id,
      isFilterReady: false,
    },
  });

  const addPanel = (defaultKey?: string, filterProps = {}) => {
    const filterCriteria = {
      id,
      defaultKey,
      histogramOptions,
      isFilterReady: false,
      ...filterProps,
    };

    // @ts-ignore
    setFilterData((preState) => {
      return {
        ...preState,
        [id]: filterCriteria,
      };
    });

    // 滚动到新增的 panel 位置
    setTimeout(() => {
      const dom = document.getElementById(`panel-${filterCriteria.id}`);
      if (dom) dom.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 100);
    return filterCriteria;
  };

  const handleFilterOptionsChange = (options: Record<string, any>) => {
    let defaultData: GraphData = {
      nodes: [],
      edges: [],
    };
    const graphData = graph?.getData();
    Object.values(options).forEach((filterCriteria) => {
      const newData = filterGraphData(
        graphData!,
        filterCriteria as StatisticsFilterCondition,
        true,
      );
      defaultData.nodes = [...(defaultData?.nodes ?? []), ...(newData?.nodes ?? [])];
      defaultData.edges = [...(defaultData?.edges ?? []), ...(newData?.edges ?? [])];
    });

    // 去重
    defaultData.nodes = uniqueElementsBy(
      defaultData?.nodes ?? [],
      (n1, n2) => n1.id === n2.id,
    );
    defaultData.edges = uniqueElementsBy(
      defaultData?.edges!,
      (e1, e2) => e1.id === e2.id,
    );

    highlightSubGraph(graph!, defaultData);
  };

  useEffect(() => {
    handleFilterOptionsChange(filterdata);
  }, [filterdata]);

  //删除事件
  const handleDelete = (index: string) => (
    <Popconfirm
      title="你确定要删除吗?"
      placement="topRight"
      okText="确认"
      cancelText="取消"
      onConfirm={() => {
        setFilterData((preState) => {
          const newFilterOptions: Record<string, any> = {};
          for (let key in preState) {
            if (key !== index) {
              newFilterOptions[key] = preState[key];
            }
          }
          return newFilterOptions;
        });
      }}
    >
      <CloseOutlined
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    </Popconfirm>
  );

  const updateFilterCriteria = (
    id: string,
    filterCriteria: StatisticsFilterCondition,
  ) => {
    setFilterData((preState) => {
      const newFilterOptions = {
        ...preState,
        [id]: filterCriteria,
      };
      return newFilterOptions;
    });
  };

  const handleReset = () => {
    form.resetFields();
    setFilterData(() => {
      const defaultFilterOptions = {
        [id]: {
          defaultKey: undefined,
          histogramOptions: undefined,
          id,
          isFilterReady: false,
        },
      };
      return defaultFilterOptions;
    });
  };

  return (
    <div className={styles['statictics-filter-container']}>
      <div className={styles['statictics-filter-container-form']}>
        <Form form={form} layout="vertical">
          {Object.values(filterdata).map((filterCriteria, index) => {
            return (
              <FilterSelection
                filterCondition={filterCriteria}
                updateFilterCondition={updateFilterCriteria}
                removeFilterCondition={handleDelete}
                schemaList={graphSchema}
                key={index}
                index={index}
              />
            );
          })}
          <Button
            block
            style={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6A6B71',
              height: 94,
              backgroundImage:
                'linear-gradient(174deg, rgba(245,248,255,0.38) 11%, rgba(244,247,255,0.55) 96%)',
              border: 'none',
            }}
            onClick={() => {
              addPanel();
            }}
          >
            <IconFont type="icon-filter-color" style={{ fontSize: 20 }} />
            <span>添加筛选组</span>
          </Button>
        </Form>
      </div>
      <div className={styles['statictics-button-group']}>
        <Button onClick={handleReset}>重置</Button>
      </div>
    </div>
  );
};

export default StatisticsFilter;
