import IconFont from '@/components/icon-font';
import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Collapse, Form, Select } from 'antd';
import React, { useState } from 'react';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value/';
import { StatisticsFilterCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { AttributeSelect } from '@/domains-core/graph-analysis/graph-schema/components/statistics-filter-attribute-select';
import styles from './index.less';

const { Panel } = Collapse;
const { OptGroup, Option } = Select;

interface FilterSelectionProps {
  filterCondition: StatisticsFilterCondition;
  updateFilterCondition: (
    id: string,
    filterCondition: StatisticsFilterCondition,
  ) => void;
  removeFilterCondition: (id: string) => void;
  defaultKey?: string;
  index?: number;
  form?: any;
  schemaList: {
    nodes: any[];
    edges: any[];
  };
}

const FilterSelection: React.FC<FilterSelectionProps> = (props) => {
  const { graphSchemaStyle, graphSchema } = useSchemaFormValue();

  const { filterCondition, removeFilterCondition, form, schemaList, index } =
    props;
  const label = Form.useWatch(`label-${filterCondition.id}`, form);

  const [state, setState] = useState<{
    currentSchema: Record<string, any>;
    currentProperty: Record<string, any>;
    currentValue: string;
  }>({
    currentSchema: {},
    currentProperty: {},
    currentValue: '',
  });

  const handleLabelChange = (value: string) => {
    let schemaArr: Record<string, any>[] = [];
    // 过滤出 schemaType 的值，设置当前的 Schema
    if (value) {
      schemaArr = [...schemaList.nodes, ...schemaList.edges].filter(
        (element) => element.nodeType === value || element.edgeType === value,
      );
      if (schemaArr.length > 0) {
        setState({
          ...state,
          currentSchema: schemaArr[0],
          currentValue: value,
        });
      }
    }
  };
  return (
    <div
      key={filterCondition.id}
      id={`panel-${filterCondition.id}`}
      className={styles['tugraph-filter-panel-group']}
    >
      <Collapse
        defaultActiveKey={['1']}
        style={{
          marginBottom: 16,
          backgroundImage:
            'linear-gradient(178deg, rgba(245,248,255,0.38) 11%, rgba(244,247,255,0.55) 96%)',
        }}
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretRightOutlined rotate={isActive ? 90 : 0} />
        )}
      >
        <Panel
          header={<span>{label ? <span>{label}</span> : '未选择'}</span>}
          key="1"
          extra={removeFilterCondition(filterCondition.id) as any}
        >
          <Form.Item
            label="请选择点/边类型"
            name={`label-${filterCondition.id}`}
            rules={[{ required: true, message: '请选择点/边类型' }]}
          >
            <Select
              placeholder="请选择点/边类型"
              showSearch
              optionFilterProp="children"
              onChange={handleLabelChange}
              dropdownClassName={styles['nodes-edges-options']}
            >
              <OptGroup label="点">
                {graphSchema?.nodes?.map((item) => {
                  return (
                    <Option value={item.nodeType} key={item.nodeType}>
                      <IconFont
                        className={styles['img']}
                        type="icon-dian_color1"
                        style={{
                          color: graphSchemaStyle?.[item?.nodeType]
                            ?.fill as string,
                          marginRight: 8,
                        }}
                      />
                      {item.nodeType}
                    </Option>
                  );
                })}
              </OptGroup>
              <OptGroup label="边">
                {graphSchema?.edges?.map((item) => {
                  return (
                    <Option value={item.edgeType} key={item.edgeType}>
                      <IconFont
                        className={styles['img']}
                        type="icon-bian1"
                        style={{
                          color: graphSchemaStyle?.[item?.edgeType]
                            ?.fill as string,
                          marginRight: 8,
                        }}
                      />
                      {item.edgeType}
                    </Option>
                  );
                })}
              </OptGroup>
            </Select>
          </Form.Item>
          <Form.List name={`attr-${index}`} initialValue={[{}]}>
            {(fields, { add, remove }) => {
              return (
                <div>
                  {fields.map((field, index) => {
                    return (
                      <div key={field.key}>
                        <AttributeSelect
                          currentValue={state.currentValue}
                          defaultFilterCondition={filterCondition}
                          index={field.key}
                          currentSchema={state.currentSchema}
                          remove={() => remove(index)}
                        />
                      </div>
                    );
                  })}
                  <Button type="dashed" style={{ width: '100%' }} onClick={add}>
                    添加属性条件
                  </Button>
                </div>
              );
            }}
          </Form.List>
        </Panel>
      </Collapse>
    </div>
  );
};

export default FilterSelection;
