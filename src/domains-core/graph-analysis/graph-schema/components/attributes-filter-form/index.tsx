import IconFont from '@/components/icon-font';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value';
import { SchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { getOperatorListByValueType } from '@/domains-core/graph-analysis/graph-schema/utils/get-operator-list-by-value-type';
import {
  CaretRightOutlined,
  DeleteOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Collapse, Form, Input, Select, Tooltip } from 'antd';
import React, { useState } from 'react';
import styles from './index.less';

const { Panel } = Collapse;
const { OptGroup, Option } = Select;

interface props {
  id: number;
  handleDelete: (id: number) => JSX.Element;
  form: FormInstance<any>;
  graphSchema?: SchemaFormValue['graphSchema'];
}

export const AttributesEditForm: React.FC<props> = ({
  id,
  handleDelete,
  form,
  graphSchema,
}) => {
  const { graphSchemaStyle } = useSchemaFormValue();
  const [state, setState] = useState<{
    currentSchema: API.VisualNodeVO | API.VisualEdgeVO;
    currentProperty: any;
  }>({
    currentSchema: {},
    currentProperty: {},
  });
  const label = Form.useWatch(`label-${id}`, form);
  const { nodes = [], edges = [] } = graphSchema || {};

  const handleLabelChange = (value: string) => {
    // 过滤出 schemaType 的值，设置当前的 Schema
    if (value) {
      const currentSchema =
        nodes.find((node) => node.nodeType === value) ||
        edges.find((item) => item.edgeType === value);
      if (currentSchema) {
        setState({ ...state, currentSchema });
      }
    }
  };
  const handlePropertyChange = (value: string) => {
    if (value) {
      const tmpProperty = state.currentSchema?.properties?.[value];
      if (tmpProperty) {
        setState({ ...state, currentProperty: tmpProperty });
      }
    }
  };

  return (
    <div className={styles['attributes-filter-form']}>
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
          header={
            <span>
              {label ? (
                <span>{label}</span>
              ) : (
                <span style={{ color: '#1A1B25' }}>未选择</span>
              )}
            </span>
          }
          key="1"
          extra={handleDelete(id)}
        >
          <Form.Item
            label="请选择点/边类型"
            name={`label-${id}`}
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
          <p className={styles['conditionIcon']}>属性条件</p>
          <Form.List name={`conditions-${id}`} initialValue={[{}]}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name }) => (
                  <Form.Item required key={key} className={styles['formList']}>
                    <div className={styles['formList']}>
                      <Input.Group compact style={{ width: '91%' }}>
                        <Form.Item
                          rules={[{ required: true, message: '请选择' }]}
                          noStyle
                          name={[name, 'name']}
                        >
                          <Select
                            placeholder="请选择"
                            showSearch
                            filterOption={(
                              input,
                              option?: {
                                label: string;
                                value: string;
                              },
                            ) => (option?.label ?? '').includes(input)}
                            style={{ width: '35%' }}
                            onChange={handlePropertyChange}
                          >
                            {Object.keys(
                              state.currentSchema?.properties || {},
                            ).map((key) => {
                              return (
                                <Option value={key} key={key}>
                                  {key}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          name={[name, 'operator']}
                          rules={[
                            { required: true, message: '请选择查询逻辑' },
                          ]}
                        >
                          <Select style={{ width: '20%' }} allowClear>
                            {getOperatorListByValueType(
                              state.currentProperty?.schemaType,
                            ).map((logic) => {
                              return (
                                <Option value={logic.value} key={logic.label}>
                                   { logic.label}
                                </Option>
                              );
                            })}
                          </Select>
                        </Form.Item>
                        <Form.Item
                          noStyle
                          name={[name, 'value']}
                          rules={[{ required: true, message: '请输入属性值' }]}
                        >
                          <Input
                            placeholder="请输入"
                            style={{ width: '45%' }}
                          />
                        </Form.Item>
                      </Input.Group>

                      <DeleteOutlined onClick={() => remove(name)} />
                    </div>
                  </Form.Item>
                ))}
                <Form.Item style={{ marginBottom: 0, width: '91%' }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined color="#6A6B71" />}
                    style={{ color: '#6A6B71' }}
                  >
                    添加属性条件
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Panel>
      </Collapse>
    </div>
  );
};
