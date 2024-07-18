import ColorPicker from '@/components/color-picker';
import IconFont from '@/components/icon-font';
import IconPicker from '@/components/icon-picker';
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Slider,
  Switch,
} from 'antd';
import type { DefaultOptionType } from 'antd/lib/select';
import React, { useMemo } from 'react';
import {
  DEFAULT_EDGE_STYLE,
  DEFAULT_NODE_STYLE,
  EDGE_WIDTH_MARKS,
  NODE_SIZE_MARKS,
} from '@/domains-core/graph-analysis/graph-schema/constants/graph-style';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value/';
import { getOperatorListByValueType } from '@/domains-core/graph-analysis/graph-schema/utils/get-operator-list-by-value-type';
import { updateGraphStyleOptions } from '@/domains-core/graph-analysis/graph-schema/utils/update-graph-style-options';
import styles from './index.less';

const { Item } = Form;

export interface PropertyStyleFilter {
  propertyName: string;
  operator: string;
  propertyValue: string;
}

interface NodeStyleConfig {
  elementType: 'node' | 'edge';
  nodeType: string;
  nodeColor: string;
  nodeSize: number;
  nodeIcon: any;
  showProperty: boolean;
  showTypeAlias: boolean;
  displayLabels: string[];
  propertyFilters: Array<PropertyStyleFilter>;
}

interface EdgeStyleConfig {
  elementType: 'edge' | 'node';
  edgeType: string;
  edgeColor: string;
  edgeWidth: string;
  showProperty: boolean;
  showTypeAlias: boolean;
  displayLabels: string[];
  propertyFilters: Array<PropertyStyleFilter>;
}

export interface GraphStyleSettingValue {
  elementStyleList: Array<NodeStyleConfig & EdgeStyleConfig>;
}
interface GraphStyleSettingProps {
  value: GraphStyleSettingValue;
  onChange: (value: GraphStyleSettingValue) => void;
}

const GraphStyleSetting: React.FC<GraphStyleSettingProps> = ({
  value,
  onChange,
}) => {
  const [form] = Form.useForm();
  const { graph } = useSchemaGraphContext();
  const elementStyleList = Form.useWatch('elementStyleList', form);
  const { graphSchema } = useSchemaFormValue();
  const { nodeOptions, edgeOptions } = useMemo(() => {
    const nodeOptions = graphSchema?.nodes?.map((item) => ({
      label: item.nodeType,
      value: item.nodeType,
    }));
    const edgeOptions = graphSchema?.edges.map((item) => ({
      label: item.edgeType,
      value: item.edgeType,
    }));
    return {
      nodeOptions,
      edgeOptions,
    };
  }, [graphSchema]);

  const getPropertyOptions = (options: {
    firstLevelIndex: number;
    index?: number;
  }) => {
    const { firstLevelIndex, index } = options;

    let propertyOptions: DefaultOptionType[] = [];
    if (!elementStyleList || !elementStyleList[firstLevelIndex]) {
      return {
        propertyOptions,
      };
    }
    const { propertyFilters, elementType } = elementStyleList[
      firstLevelIndex
    ] as {
      propertyFilters: Array<PropertyStyleFilter>;
      elementType: 'node' | 'edge';
    };
    let schemaType = '';

    if (elementType) {
      const type = `${elementType}Type` as 'nodeType';

      const schema = graphSchema
        ? graphSchema[`${elementType}s`]?.find(
          (element) =>
            element[type] === elementStyleList?.[firstLevelIndex]?.[type],
        )
        : {};
      const { properties } = schema || {};
      if (properties) {
        propertyOptions = Object.keys(properties).map((item) => ({
          label: item,
          value: item,
        }));
        if (typeof index === 'number' && propertyFilters?.[index]) {
          const { propertyName } = propertyFilters?.[index];
          schemaType = properties[propertyName]?.schemaType;
        }
      }
    }

    return {
      propertyOptions,
      schemaType,
    };
  };
  const onValuesChange = (changedValue: any, allValue: any) => {
    onChange?.(allValue);
  };
  const onSubmit = () => {
    updateGraphStyleOptions({
      graph,
      styles: { elementStyleList },
      graphSchema,
    });
  };

  return (
    <div className={styles['graph-style-setting']}>
      <Form
        form={form}
        layout="vertical"
        className={styles['node-edge-form']}
        onValuesChange={onValuesChange}
        initialValues={value}
      >
        <Form.List name="elementStyleList" initialValue={[{}]}>
          {(fields, { add, remove }) => {
            return (
              <div>
                {fields.map((field, firstLevelIndex) => {
                  const { propertyOptions } = getPropertyOptions({
                    firstLevelIndex,
                  });
                  const { elementType } =
                    elementStyleList?.[firstLevelIndex] || {};
                  return (
                    <Collapse
                      key={field.key}
                      bordered={false}
                      defaultActiveKey={field.key}
                    >
                      <Collapse.Panel
                        header={
                          <div className={styles['collapse-header']}>
                            <div>{`样式配置 ${firstLevelIndex + 1}`}</div>
                            {firstLevelIndex !== 0 ? (
                              <IconFont
                                type="icon-shanchu"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  remove(field.name);
                                }}
                              />
                            ) : null}
                          </div>
                        }
                        key={field.key}
                        style={{
                          marginBottom: 10,
                          background: '#fff',
                        }}
                      >
                        <Item
                          name={[field.name, 'elementType']}
                          style={{ marginBottom: 0 }}
                          initialValue="node"
                        >
                          <Radio.Group
                            options={[
                              {
                                label: '点样式',
                                value: 'node',
                              },
                              {
                                label: '边样式',
                                value: 'edge',
                              },
                            ]}
                            style={{ marginBottom: 20 }}
                          />
                        </Item>
                        {elementType === 'node' ? (
                          <>
                            <Item
                              name={[field.name, 'nodeType']}
                              label="点类型"
                            >
                              <Select showSearch options={nodeOptions} />
                            </Item>
                            <Item
                              name={[field.name, 'nodeSize']}
                              label="大小"
                              initialValue={DEFAULT_NODE_STYLE.size}
                            >
                              <Slider
                                marks={NODE_SIZE_MARKS}
                                min={5}
                                max={100}
                              />
                            </Item>
                            <Item
                              name={[field.name, 'nodeColor']}
                              label="颜色"
                              initialValue={DEFAULT_NODE_STYLE.color}
                            >
                              <ColorPicker maxLength={7} />
                            </Item>
                            <Item name={[field.name, 'nodeIcon']} label="图标">
                              <IconPicker maxLength={7} />
                            </Item>
                            <Row>
                              <Col span={12}>
                                <Item
                                  label="显示属性"
                                  name={[field.name, 'showProperty']}
                                  valuePropName="checked"
                                >
                                  <Switch size="small" />
                                </Item>
                              </Col>
                              <Col span={12}>
                                <Item
                                  label="显示别名"
                                  name={[field.name, 'showTypeAlias']}
                                >
                                  <Switch size="small" />
                                </Item>
                              </Col>
                            </Row>
                            <Item
                              label="文本对应属性"
                              name={[field.name, 'displayLabels']}
                              initialValue={['ID']}
                            >
                              <Select
                                mode="multiple"
                                options={propertyOptions}
                                showSearch
                              />
                            </Item>
                            <div style={{ marginBottom: 6 }}>属性筛选</div>
                            <Form.List name={[field.name, 'propertyFilters']}>
                              {(fields, { add, remove }) => {
                                return (
                                  <div>
                                    {fields.map((field, index) => {
                                      const { propertyOptions, schemaType } =
                                        getPropertyOptions({
                                          firstLevelIndex,
                                          index,
                                        });
                                      return (
                                        <Input.Group key={index}>
                                          <Row gutter={8} align="middle">
                                            <Col span={8}>
                                              <Item
                                                name={[
                                                  field.name,
                                                  'propertyName',
                                                ]}
                                              >
                                                <Select
                                                  options={propertyOptions}
                                                  showSearch
                                                />
                                              </Item>
                                            </Col>
                                            <Col span={6}>
                                              <Item
                                                name={[field.name, 'operator']}
                                              >
                                                <Select
                                                  style={{ width: '100%' }}
                                                  options={getOperatorListByValueType(
                                                    schemaType,
                                                  )}
                                                />
                                              </Item>
                                            </Col>
                                            <Col span={8}>
                                              <Item
                                                name={[
                                                  field.name,
                                                  'propertyValue',
                                                ]}
                                              >
                                                <Input />
                                              </Item>
                                            </Col>
                                            <Col span={2}>
                                              <Item>
                                                <IconFont
                                                  type="icon-shanchu"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    remove(field.name);
                                                  }}
                                                  style={{ fontSize: 20 }}
                                                />
                                              </Item>
                                            </Col>
                                          </Row>
                                        </Input.Group>
                                      );
                                    })}
                                    <Button
                                      type="dashed"
                                      onClick={() => add()}
                                      style={{ width: '100%' }}
                                    >
                                      添加属性筛选
                                    </Button>
                                  </div>
                                );
                              }}
                            </Form.List>
                          </>
                        ) : (
                          <>
                            <Item
                              name={[field.name, 'edgeType']}
                              label="边类型"
                            >
                              <Select showSearch options={edgeOptions} />
                            </Item>
                            <Item
                              name={[field.name, 'edgeWidth']}
                              label="边宽"
                              initialValue={1}
                            >
                              <Slider
                                marks={EDGE_WIDTH_MARKS}
                                min={1}
                                max={10}
                              />
                            </Item>
                            <Item name={[field.name, 'edgeColor']} label="颜色">
                              <ColorPicker maxLength={7} />
                            </Item>
                            <Row>
                              <Col span={12}>
                                <Item
                                  label="显示属性"
                                  name={[field.name, 'showProperty']}
                                >
                                  <Switch size="small" />
                                </Item>
                              </Col>
                              <Col span={12}>
                                <Item
                                  label="显示别名"
                                  name={[field.name, 'showTypeAlias']}
                                >
                                  <Switch size="small" />
                                </Item>
                              </Col>
                            </Row>
                            <Item
                              label="文本对应属性"
                              name={[field.name, 'displayLabels']}
                            >
                              <Select
                                options={propertyOptions}
                                showSearch
                                mode="multiple"
                              />
                            </Item>
                            <div style={{ marginBottom: 6 }}>属性筛选</div>
                            <Form.List name={[field.name, 'propertyFilters']}>
                              {(fields, { add, remove }) => {
                                return (
                                  <div>
                                    {fields.map((field, index) => {
                                      const { propertyOptions, schemaType } =
                                        getPropertyOptions({
                                          firstLevelIndex,
                                          index,
                                        });
                                      return (
                                        <Input.Group key={index}>
                                          <Row gutter={8} align="middle">
                                            <Col span={8}>
                                              <Item
                                                name={[
                                                  field.name,
                                                  'propertyName',
                                                ]}
                                              >
                                                <Select
                                                  options={propertyOptions}
                                                  showSearch
                                                />
                                              </Item>
                                            </Col>
                                            <Col span={6}>
                                              <Item
                                                name={[field.name, 'operator']}
                                              >
                                                <Select
                                                  style={{ width: '100%' }}
                                                  options={getOperatorListByValueType(
                                                    schemaType,
                                                  )}
                                                />
                                              </Item>
                                            </Col>
                                            <Col span={8}>
                                              <Item
                                                name={[
                                                  field.name,
                                                  'propertyValue',
                                                ]}
                                              >
                                                <Input />
                                              </Item>
                                            </Col>{' '}
                                            <Col span={2}>
                                              <Item>
                                                <IconFont
                                                  type="icon-shanchu"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    remove(field.name);
                                                  }}
                                                  style={{ fontSize: 20 }}
                                                />
                                              </Item>
                                            </Col>
                                          </Row>
                                        </Input.Group>
                                      );
                                    })}
                                    <Button
                                      type="dashed"
                                      onClick={() => add()}
                                      style={{ width: '100%' }}
                                    >
                                      添加属性筛选
                                    </Button>
                                  </div>
                                );
                              }}
                            </Form.List>
                          </>
                        )}
                      </Collapse.Panel>
                    </Collapse>
                  );
                })}
                <Button
                  type="dashed"
                  onClick={() =>
                    add({
                      elementType: 'node',
                      nodeSize: DEFAULT_NODE_STYLE.size,
                      nodeColor: DEFAULT_NODE_STYLE.color,
                      displayLabels: ['ID'],
                      edgeColor: DEFAULT_EDGE_STYLE.color,
                      edgeWidth: DEFAULT_EDGE_STYLE.width,
                    })
                  }
                  style={{ width: '100%' }}
                >
                  添加样式
                </Button>
              </div>
            );
          }}
        </Form.List>

        <div className={styles.footer}>
          <Button type="primary" onClick={onSubmit}>
            确定
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default GraphStyleSetting;
