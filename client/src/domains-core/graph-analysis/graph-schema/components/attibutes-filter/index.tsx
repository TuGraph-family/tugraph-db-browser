import IconFont from '@/components/icon-font';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value/';
import { TypePropertyCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { filterByTopRule } from '@/domains-core/graph-analysis/graph-schema/utils/filter-by-top-rule';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Form, Popconfirm } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useState } from 'react';
import styles from './index.less';

const AttributesFilter: React.FC = () => {
  const [form] = Form.useForm();
  const { graph } = useSchemaGraphContext();
  const { graphSchema } = useSchemaFormValue();
  const [filterdata, setFilterData] = useState([{ id: Date.now() }]);

  const addPanel = () => {
    const addData = cloneDeep(filterdata);
    addData.push({
      id: Date.now(),
    });
    setFilterData(addData);
  };

  //删除事件
  const handleDelete = (id: number) => (
    <Popconfirm
      title="你确定要删除吗?"
      placement="topRight"
      okText="确认"
      cancelText="取消"
      onConfirm={() => {
        const deleteData = filterdata.filter(item => item.id !== id);
        setFilterData(deleteData);
      }}
    >
      <CloseOutlined
        onClick={event => {
          event.stopPropagation();
        }}
      />
    </Popconfirm>
  );
  const getConditions = (params: Record<string, any>) => {
    const conditions: TypePropertyCondition[] = [];
    for (const key in params) {
      if (key.startsWith('label-')) {
        const labelValue = params[key];
        const rulesKey = `conditions-${key.slice(6)}`;
        const rulesValue = params[rulesKey];
        conditions.push({ type: labelValue, conditions: rulesValue });
      }
    }
    return conditions;
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();

    const conditions = getConditions(values);
    // 筛选出符合条件的节点

    const graphData = graph?.getData() || {};

    let nodeIds: string[] = [];
    let edgeIds: string[] = [];
    conditions.forEach(condition => {
      nodeIds = (
        graphData.nodes?.filter(node =>
          filterByTopRule(
            {
              id: node.id,
              label: node.label,
              properties: { ...node.properties, ID: node.id },
            },
            condition,
          ),
        ) || []
      ).map(item => item.id);

      edgeIds = (
        graphData.edges?.filter(edge =>
          filterByTopRule(
            {
              id: edge.id,
              label: edge.label,
              properties: { ...edge.properties, ID: edge.id },
            },
            condition,
          ),
        ) || []
      ).map(item => item.id!);
    });
    graphData.nodes?.forEach(node => {
      const hasMatch = nodeIds.includes(node.id);
      if (hasMatch) {
        graph?.setElementState(node.id, 'active', true);
        graph?.focusElement(node.id);
      }
    });

    graphData.edges?.forEach(edge => {
      const hasMatch = edgeIds.includes(edge.id!);
      if (hasMatch) {
        graph?.setElementState(edge.id!, 'active', true);
        graph?.focusElement(edge.id!);
      }
    });
  };

  return (
    <div className={styles['attribute-filter-container']}>
      <div className={styles['attribute-filter-container-form']}>
        <Form form={form} layout="vertical">
          {filterdata.map(item => {
            return (
              <AttributesEditForm
                key={item.id}
                id={item.id}
                handleDelete={handleDelete}
                form={form}
                graphSchema={graphSchema}
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
      <div className={styles['attribute-button-group']}>
        <Button
          style={{ marginRight: 8 }}
          onClick={() => {
            form.resetFields();
          }}
        >
          重置
        </Button>
        <Button htmlType="submit" type="primary" onClick={handleSubmit}>
          确认
        </Button>
      </div>
    </div>
  );
};

export default AttributesFilter;
