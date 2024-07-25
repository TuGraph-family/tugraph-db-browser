import IconFont from '@/components/icon-font';
import { parseSearch } from '@/utils/parseSearch';
import { useRequest } from 'ahooks';
import { cloneDeep, divide, find, isEmpty, map } from 'lodash';
import { GraphData } from '@antv/g6';
import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Tooltip,
} from 'antd';
import React, { memo, useEffect } from 'react';
import { useImmer } from 'use-immer';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value/';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
// import QueryService from '@/domains-core/graph-analysis/graph-schema/services/graph-data';
import { getOperatorListByValueType } from '@/domains-core/graph-analysis/graph-schema/utils/get-operator-list-by-value-type';
import { mergeGraphData } from '@/domains-core/graph-analysis/graph-schema/utils/merge-graph-data';
import styles from './index.less';
import { useAnalysis } from '@/hooks/useAnalysis';
import { parseHashRouterParams } from '@/utils/parseHash';
import { IAllValuesParams, IPropertiesParams } from '@/types/services';

const { Option } = Select;

const ConfigQuery: React.FC = () => {
  const { onQuickQuery, onQuickQueryLoading } = useAnalysis();
  const [form] = Form.useForm();
  const { graphEngineType, graphSchemaStyle, graphSchema } =
    useSchemaFormValue();
  const { tabContainerField } = useSchemaTabContainer();
  const { graph } = useSchemaGraphContext();
  const { graphName } = parseHashRouterParams(location.hash);

  const [state, setState] = useImmer<{
    currentPropertyType: string;
    currentSchema: any;
    selectTag: string;
  }>({
    currentPropertyType: '',
    currentSchema: {},
    selectTag: '',
  });

  const { currentSchema, currentPropertyType } = state;
  const handleValueChange = async (changedValue: IPropertiesParams, allValues: IAllValuesParams) => {
    if(changedValue.label){
      form.setFieldsValue({
        property: undefined,
        logic: undefined,
      });
      setState(draft => {
        draft.currentPropertyType = '';
      });
    }
      const { label, property } = allValues;
      const currentSchema = find(
        graphSchema?.nodes,
        node => node?.nodeType === label,
      );
      if (currentSchema) {
        setState(draft => {
          draft.currentSchema = cloneDeep(currentSchema);
        });

        // 设置当前选中的属性值，根据选择的属性值类型，填充不同的逻辑值
        if (property && changedValue.property) {
          const tmpProperty = currentSchema.properties[property];

          if (tmpProperty) {
            setState(draft => {
              draft.currentPropertyType = tmpProperty.schemaType;
            });
          }
        }
      }
  };
  useEffect(() => {
    if (isEmpty(graphSchema?.edges) && isEmpty(graphSchema?.nodes)) {
      return;
    }

    const values = form.getFieldsValue();
    const { label } = values;
    if (label) {
      handleValueChange({}, { label });
    }
  }, [graphSchema]);

  // TODO 应该改为后端提供有数据的节点类型
  // const nodeTags = useMemo(
  //   () => map(graphSchema?.nodes, (item) => item?.nodeType)?.slice(0, 4),
  //   [graphSchema],
  // );

  const handleExecQuery = async () => {
    const values = await form.validateFields();

    const { label, property, value, logic, limit = 10, hasClear } = values;

    tabContainerField.setComponentProps({
      spinning: true,
    });

    const result = await onQuickQuery({
      graphName,
      limit,
      rules: {
        property,
        logic,
        value,
      },
      node: label,
    });

    tabContainerField.setComponentProps({
      spinning: false,
    });

    const { success, graphData } = result || {};

    if (!success) {
      message.error(result?.errorMessage);
      return;
    }

    if (graphData?.nodes?.length === 0) {
      message.warn('未查询到符合条件的节点');
      return;
    }

    if (hasClear) {
      graph?.setData(graphData as GraphData);
    } else {
      // 在画布上叠加数据
      const originData: any = graph?.getData();
      const newData = mergeGraphData(originData, graphData);
      graph?.setData(newData!);
    }
    graph?.render();
  };

  // const handleTagChange = async (tag: string, checked: boolean) => {
  //   if (checked) {
  //     // 选中
  //     setState((draft) => {
  //       draft.selectTag = tag;
  //     });

  //     // TODO 需要后端提供接口
  //   } else {
  //     setState((draft) => {
  //       draft.selectTag = '';
  //     });
  //   }
  // };

  const handleResetForm = () => {
    form.resetFields();
    setState(draft => {
      draft.currentSchema = {};
    });
  };
  return (
    <div className={styles['quick-query-container']}>
      <Form
        form={form}
        className={styles['quick-query-form']}
        layout="vertical"
        onValuesChange={handleValueChange}
        style={{ height: '100%', overflow: 'auto' }}
      >
        <div className={styles['form-container']}>
          <Form.Item
            label="节点类型"
            name="label"
            rules={[{ required: true, message: '请选择节点类型' }]}
          >
            <Select
              placeholder="请选择"
              style={{ width: '100%' }}
              showSearch
              allowClear
            >
              {map(graphSchema?.nodes, (schema, key) => {
                return (
                  <Option key={key} value={schema?.nodeType}>
                    <IconFont
                      className={styles['img']}
                      type="icon-dian_color1"
                      style={{
                        color: graphSchemaStyle?.[schema?.nodeType]?.fill,
                      }}
                    />
                    {schema?.nodeType}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item label="属性条件" name="attribute" required={true}>
            <Input.Group compact>
              <Form.Item
                noStyle
                rules={[{ required: true, message: '请选择图元素属性' }]}
                name="property"
              >
                <Select
                  placeholder="请选择"
                  style={{ width: '35%' }}
                  showSearch
                  allowClear
                >
                  {map(currentSchema?.properties, (property, key) => {
                    return (
                      <Option value={property.name} key={key}>
                        {property.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                noStyle
                name="logic"
                rules={[{ required: true, message: '请选择查询逻辑' }]}
              >
                <Select
                  style={{ width: '20%' }}
                  allowClear
                  options={getOperatorListByValueType(currentPropertyType)}
                  notFoundContent={
                    <div style={{ textAlign: 'center' }}>No Data</div>
                  }
                />
              </Form.Item>
              <Form.Item
                noStyle
                name="value"
                rules={[{ required: true, message: '请输入属性值' }]}
              >
                <Input placeholder="请输入" style={{ width: '45%' }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item initialValue={1000} label="返回节点数目" name="limit">
            <InputNumber
              placeholder="请输入"
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="hasClear" valuePropName="checked">
            <Checkbox>
              清空画布数据
              <Tooltip title="不清空则默认追加到画布">
                <IconFont
                  style={{ marginLeft: '5px' }}
                  type="icon-question-circle"
                />
              </Tooltip>
            </Checkbox>
          </Form.Item>
        </div>
        {/* <div className={styles['other-container']}>
          <span style={{ marginRight: 8 }}>
            <Space size={4}>
              快速开始
              <Tooltip
                style={{ marginLeft: 4 }}
                title="默认查询对应点类型的前一百个点。"
              >
                <IconFont
                  type="icon-question-circle"
                  style={{ cursor: 'pointer' }}
                />
              </Tooltip>
            </Space>
          </span>

          <Space size={[0, 8]} wrap>
            {map(nodeTags, (tag, key) => (
              <CheckableTag
                key={key}
                checked={state.selectTag === tag}
                onChange={(checked) => handleTagChange(tag, checked)}
                style={{
                  backgroundColor:
                    state.selectTag === tag ? '#3056E3' : '#E6EBF6',
                  borderRadius: 20,
                }}
              >
                {tag}
              </CheckableTag>
            ))}
          </Space>
        </div> */}
        <div></div>
      </Form>
      <div className={styles['button-container']}>
        <Space>
          <Button className="queryButton" onClick={handleResetForm}>
            重置
          </Button>
          <Button
            loading={onQuickQueryLoading}
            className={styles['query-button']}
            type="primary"
            onClick={handleExecQuery}
          >
            查询
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default memo(ConfigQuery);
