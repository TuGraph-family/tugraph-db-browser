import {
  BarChartOutlined,
  DeleteOutlined,
  FireTwoTone,
  PieChartOutlined,
  SelectOutlined,
} from '@ant-design/icons';
import { Button, Col, Dropdown, Form, Menu, Row, Select, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value';
import { StatisticsFilterCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { getChartData } from '@/domains-core/graph-analysis/graph-schema/utils/get-chart-data';
import { getHistogramData } from '@/domains-core/graph-analysis/graph-schema/utils/get-histogram-data';
import { getPropertyValueRanks } from '@/domains-core/graph-analysis/graph-schema/utils/get-property-value-ranks';
import { graphData2PropertyGraph } from '@/domains-core/graph-analysis/graph-schema/utils/graph-data-2-property-graph';
import ColumnChart from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter-column-chart';
import HistogramChart from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter-histogram-chart';
import LineChart from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter-line-chart';
import PieChart from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter-pie-chart';
import WordCloudChart from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter-world-cloud-chart';
import styles from './index.less';
import { DATA_TYPE, NUMBER_TYPES } from '@/domains-core/graph-analysis/graph-schema/constants/action-bar';

interface AttributeSelectionProps {
  defaultFilterCondition: StatisticsFilterCondition;
  currentSchema: Record<string, any>;
  currentValue: string;
  remove: () => void;
  index?: number;
}

const analyzerType2Icon: Record<string, React.ReactNode> = {
  COLUMN: <BarChartOutlined />,
  PIE: <PieChartOutlined />,
  SELECT: <SelectOutlined />,
};

export const AttributeSelect: React.FC<AttributeSelectionProps> = ({
  defaultFilterCondition,
  currentSchema,
  currentValue,
  index,
  remove,
}) => {
  const { graph } = useSchemaGraphContext();
  const { graphSchema } = useSchemaFormValue();
  const graphData = graph?.getData();

  const [state, setState] = useImmer<{
    filterCondition: StatisticsFilterCondition;
  }>({
    filterCondition: defaultFilterCondition,
  });
  const { filterCondition } = state;
  // 对于离散类型的数据支持切换图表类型
  const [enableChangeChartType, setEnableChangeChartType] =
    useState<boolean>(false);

  const onSelectChange = (value: string) => {
    const id = filterCondition.id as string;
    const elementType = currentSchema.nodeType ? 'node' : 'edge';

    const elementProps: Record<string, any> = currentSchema.properties;
    let analyzerType: StatisticsFilterCondition['analyzerType'];

    if (!elementProps) {
      analyzerType = 'NONE';
      setState((draft) => {
        draft.filterCondition = {
          ...filterCondition,
          id,
          isFilterReady: false,
          elementType,
          prop: value,
          analyzerType,
        };
      });
      setEnableChangeChartType(false);
      return;
    }

    const current = elementProps[value];
    const propertyType = current.schemaType;
    if (NUMBER_TYPES.includes(propertyType)) {
      analyzerType = 'HISTOGRAM';
      setState((draft) => {
        draft.filterCondition = {
          ...filterCondition,
          id,
          analyzerType,
          isFilterReady: false,
          elementType,
          prop: value,
        };
      });
      setEnableChangeChartType(false);
    } else if (propertyType === 'BOOL') {
      analyzerType = 'COLUMN';
      setState((draft) => {
        draft.filterCondition = {
          ...filterCondition,
          id,
          isFilterReady: false,
          elementType,
          prop: value,
          analyzerType,
        };
      });

      setEnableChangeChartType(false);
    } else if (propertyType === 'STRING') {
      const chartData = getChartData(
        graphData!,
        value,
        elementType,
        currentValue,
      );
      let selectOptions = [...chartData.keys()].map((key) => ({
        value: key,
        label: key,
      }));
      if (chartData.size <= 5) {
        analyzerType = 'PIE';
      } else if (chartData.size <= 10) {
        analyzerType = 'COLUMN';
      } else {
        analyzerType = 'SELECT';
        const propertyGraphData = graphData2PropertyGraph(
          graphData!,
          graphSchema,
        );
        const sorttedValues = getPropertyValueRanks(
          propertyGraphData,
          elementType,
          value,
        );
        selectOptions = selectOptions.map((option) => {
          const { value } = option;
          const { rank, isOutlier } =
            sorttedValues.find((item) => item.propertyValue === value) || {};
          return {
            ...option,
            rank,
            isOutlier,
          };
        });
      }
      setState((draft) => {
        draft.filterCondition = {
          ...filterCondition,
          id,
          isFilterReady: false,
          elementType,
          prop: value,
          analyzerType,
          selectOptions,
          chartData,
        };
      });
      setEnableChangeChartType(true);
    } else if (DATA_TYPE.includes(propertyType)) {
      analyzerType = 'DATE';
      setState((draft) => {
        draft.filterCondition = {
          ...filterCondition,
          id,
          isFilterReady: false,
          elementType,
          prop: value,
          analyzerType,
        };
      });
      setEnableChangeChartType(false);
    }
  };

  const onValueSelectChange = (
    value: StatisticsFilterCondition['selectValue'],
  ) => {
    const isFilterReady = value?.length !== 0;
    setState((draft) => {
      draft.filterCondition = {
        ...filterCondition,
        isFilterReady,
        selectValue: value,
      };
    });
  };

  const changeChartType = (key: StatisticsFilterCondition['analyzerType']) => {
    setState((draft) => {
      draft.filterCondition = {
        ...filterCondition,
        analyzerType: key,
      };
    });
  };

  const elementProps = currentSchema.properties; // filterCondition.elementType === 'node' ? nodeProperties : edgeProperties;

  // 初始展示筛选器
  useEffect(() => {
    if (filterCondition.defaultKey) {
      onSelectChange(filterCondition.defaultKey);
    }
  }, [filterCondition.defaultKey]);

  useEffect(() => {
    const { prop, elementType, analyzerType } = filterCondition;
    if (
      prop &&
      elementType &&
      analyzerType &&
      ['PIE', 'SELECT', 'WORDCLOUD'].indexOf(analyzerType) !== -1
    ) {
      const chartData = getChartData(
        graphData!,
        prop,
        elementType,
        currentValue,
      );
      setState((draft) => {
        draft.filterCondition = {
          ...filterCondition,
          chartData,
        };
      });
    }

    if (
      prop &&
      elementType &&
      analyzerType &&
      ['HISTOGRAM'].indexOf(analyzerType) !== -1
    ) {
      const histogramData = getHistogramData(graphData!, prop, elementType);
      setState((draft) => {
        draft.filterCondition = {
          ...filterCondition,
          histogramData,
        };
      });
    }
  }, [currentValue, filterCondition.analyzerType, filterCondition.elementType]);

  const menu = (
    <Menu
      onClick={(info) =>
        changeChartType(info.key as StatisticsFilterCondition['analyzerType'])
      }
      items={[
        {
          key: 'COLUMN',
          label: <BarChartOutlined />,
        },
        {
          key: 'PIE',
          label: <PieChartOutlined />,
        },
        {
          key: 'SELECT',
          label: <SelectOutlined />,
        },
      ]}
    />
  );

  const getPropertyOptions = () => {
    const elementProps = currentSchema.properties || {};
    return Object.keys(elementProps).map((key) => {
      return (
        <Select.Option value={key} key={key}>
          {key}
        </Select.Option>
      );
    });
  };
  return (
    <Form.Item name={index} key={index} noStyle>
      <Space
        style={{ marginBottom: 12, width: '100%' }}
        align="baseline"
        className={styles['space-statistic-panel']}
      >
        <Form.Item
         style={{ width: '100%' }}
          name="arrt"
          label="选择属性"
          rules={[{ required: true, message: '请选择属性' }]}
        >
          <Select
            style={{ width: '100%' }}
            onChange={onSelectChange}
            placeholder="选择元素属性"
            showSearch
            filterOption={(input, option) => {
              return (option?.value as string)
                ?.toLowerCase()
                .includes(input.toLowerCase());
            }}
            value={filterCondition.prop ? `${filterCondition.prop}` : undefined}
            allowClear
          >
            {getPropertyOptions()}
          </Select>
          <Space size={0} className={styles['add-attr']}>
            {enableChangeChartType && (
              <Dropdown overlay={menu}>
                <Button
                  icon={analyzerType2Icon[filterCondition.analyzerType!]}
                  type="text"
                ></Button>
              </Dropdown>
            )}
            <Button
              type="text"
              onClick={() => remove()}
              icon={<DeleteOutlined />}
            />
          </Space>
        </Form.Item>
      </Space>

      <div
        className={styles['tugraph-filter-panel-value']}
        id={`${filterCondition.id}-chart-container-${index}`}
        style={{ marginTop: -20 }}
      >
        {filterCondition.analyzerType === 'SELECT' && (
          <Select
            style={{ width: '100%' }}
            onChange={onValueSelectChange}
            mode="tags"
            placeholder="选择筛选值"
            value={filterCondition.selectValue}
            allowClear
          >
            {filterCondition.selectOptions?.map((option) => {
              const { rank, label, value } = option;
              return (
                <Select.Option value={value} key={value as string}>
                  {rank !== undefined && rank < 3 ? (
                    <Row style={{ width: '100%' }}>
                      <Col span={20}>{label}</Col>
                      <Col span={4}>
                        {new Array(3 - rank).fill(
                          <FireTwoTone twoToneColor="#eb2f96" />,
                        )}
                      </Col>
                    </Row>
                  ) : (
                    label
                  )}
                </Select.Option>
              );
            })}
          </Select>
        )}

        {filterCondition.analyzerType === 'PIE' && (
          <PieChart
            filterCondition={filterCondition}
            updateFilterCondition={(data) =>
              setState((draft) => {
                draft.filterCondition = data;
              })
            }
            index={index}
          />
        )}

        {filterCondition.analyzerType === 'WORDCLOUD' && (
          <WordCloudChart
            filterCondition={filterCondition}
            updateFilterCondition={(data) =>
              setState((draft) => {
                draft.filterCondition = data;
              })
            }
            index={index}
          />
        )}

        {filterCondition.analyzerType === 'COLUMN' && (
          <ColumnChart
            filterCondition={filterCondition}
            updateFilterCondition={(data) =>
              setState((draft) => {
                draft.filterCondition = data;
              })
            }
            highlightRank={5}
            index={index}
          />
        )}

        {filterCondition.analyzerType === 'HISTOGRAM' && (
          <HistogramChart
            filterCondition={filterCondition}
            updateFilterCondition={(data) =>
              setState((draft) => {
                draft.filterCondition = data;
              })
            }
            index={index}
          />
        )}

        {filterCondition.analyzerType === 'DATE' && (
          <LineChart
            filterCondition={filterCondition}
            source={graphData!}
            elementProps={elementProps || {}}
            /* BrushFilter 组件问题，设置不了百分比 */
            width={
              document.getElementsByClassName('tugraph-filter-panel-prop')[0]
                .clientWidth
            }
          />
        )}

        {filterCondition.analyzerType === 'NONE' && <span>请选择合法字段</span>}
      </div>
    </Form.Item>
  );
};
