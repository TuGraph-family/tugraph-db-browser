import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { filterGraphDataByValue } from '@/domains-core/graph-analysis/graph-schema/utils/filter-graph-data-by-value';
import { hexToRGBA } from '@/domains-core/graph-analysis/graph-schema/utils/hex-to-rgba';
import { SearchOutlined } from '@ant-design/icons';
import { Badge, Col, Form, Input, Row, Select, Tag } from 'antd';
import React from 'react';
import { useImmer } from 'use-immer';
import styles from './index.less';

const { Option } = Select;

const GraphFilter: React.FC = () => {
  const [form] = Form.useForm();
  const { graph } = useSchemaGraphContext();

  const getDefaultRow = () => {
    return (
      <Row style={{ paddingLeft: 10 }}>
        <Col style={{ textAlign: 'left' }} span={10}>
          属性名称
        </Col>
        <Col span={1}></Col>
        <Col style={{ textAlign: 'left' }} span={13}>
          属性值
        </Col>
      </Row>
    );
  };

  const [state, setState] = useImmer<{
    dataList: any[];
    searchValue: string;
    schemaType: string;
  }>({
    dataList: [],
    searchValue: '',
    schemaType: 'node',
  });

  const { searchValue, dataList, schemaType } = state;

  const handleTypeChange = (value: string) => {
    setState(draft => {
      draft.schemaType = value;
    });
  };

  const handleChange = (value: string) => {
    if (value) {
      graph?.focusElement(value);
      graph?.setElementState(value, 'highlight');
    }
  };

  const handleSearch = (value: string) => {
    if (value) {
      // 计算数据
      const { nodes, edges } = graph?.getData() || {};
      const filterNodeData = nodes?.map(d => {
        const { id, label, properties, style } = d;

        return {
          id,
          label,
          properties,
          color: style?.fill || 'green',
        };
      });

      const filterEdgeData = edges?.map(d => {
        const { label, id, properties, style } = d;
        return {
          id,
          label,
          properties,
          color: style?.fill || 'green',
        };
      });
      let result: Record<string, any>[] = [];
      if (schemaType === 'node') {
        // 从节点中搜索
        result = filterGraphDataByValue(value, filterNodeData!);
      } else if (schemaType === 'edge') {
        result = filterGraphDataByValue(value, filterEdgeData!);
      }

      // 将模糊匹配到值转成 label properties value
      // 将模糊匹配到值转成 label value 这个是匹配到了 label
      const formArrData = result.map(d => {
        const { id, key, value } = d;
        const keys = key.split('.');
        if (keys.length === 2) {
          // 匹配到了 properties
          const [p, v] = keys;
          return {
            id,
            label: value.label,
            propertyKey: v,
            value: value[p][v],
            color: value.color,
          };
        }

        // 匹配到了 label
        return {
          id,
          label: value.label,
          propertyKey: key,
          value: value[key],
          color: value.color,
        };
      });

      setState(draft => {
        draft.dataList = formArrData.map(d => {
          return {
            value: d.id,
            originValue: (
              <>
                <Tag style={{ marginLeft: 4 }} color="green">
                  {d.propertyKey}
                </Tag>
                {d.value}
              </>
            ),
            text: (
              <Row style={{ paddingTop: 4 }}>
                <Col span={10} style={{ textAlign: 'left' }}>
                  <Tag
                    style={{
                      background: hexToRGBA(d.color, 0.06),
                      border: 'none',
                      borderRadius: '25px',
                    }}
                  >
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '100%',
                      }}
                    >
                      <Badge style={{ marginRight: 4 }} color={d.color} />
                      {d.propertyKey}
                    </div>
                  </Tag>
                </Col>
                <Col span={1}></Col>
                <Col span={13} style={{ textAlign: 'left' }}>
                  <Tag
                    style={{
                      background: hexToRGBA('#F6f6f6', 1),
                      border: 'none',
                      borderRadius: '25px',
                    }}
                  >
                    <div
                      style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 402 - `${d.propertyKey}`.length * 14,
                      }}
                    >
                      {d.value}
                    </div>
                  </Tag>
                </Col>
              </Row>
            ),
          };
        });
      });
    } else {
      setState(draft => {
        draft.dataList = [];
      });
    }
  };

  return (
    <div className={styles['graph-filter']}>
      <Form
        form={form}
        className={styles['quickQueryForm']}
        layout="vertical"
        style={{ height: '100%', overflow: 'auto' }}
      >
        <Form.Item>
          <Input.Group compact>
            <Form.Item noStyle name="property" initialValue={schemaType}>
              <Select style={{ width: 68 }} onChange={handleTypeChange}>
                <Option value="node" key="node">
                  点
                </Option>
                <Option value="edge" key="edge">
                  边
                </Option>
              </Select>
            </Form.Item>
            <Form.Item noStyle name="value">
              <Select
                showSearch
                allowClear
                value={searchValue}
                style={{ minWidth: 320 }}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                notFoundContent={null}
                optionLabelProp="label"
                suffixIcon={<SearchOutlined />}
                placeholder="请输入属性名称/点ID"
              >
                <Select.OptGroup key="simple-query" label={getDefaultRow()}>
                  {dataList.map(d => {
                    return (
                      <Option
                        key={d.value}
                        value={d.value}
                        label={d.originValue}
                      >
                        {d.text}
                      </Option>
                    );
                  })}
                </Select.OptGroup>
              </Select>
            </Form.Item>
          </Input.Group>
        </Form.Item>
      </Form>
    </div>
  );
};

export default GraphFilter;
