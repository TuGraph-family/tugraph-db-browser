import { Form, Input, Select, Table, TableProps } from 'antd';
import type { FormInstance } from 'antd/es/form';
import { cloneDeep } from 'lodash';
import React, { createContext, useContext, useEffect } from 'react';
import { EditType } from '../../constant';

import styles from './index.module.less';

const EditableContext = createContext<FormInstance<any> | null>(null);
const TableContext = createContext<{
  onChange?: (i: any) => void;
  data?: Array<any>;
  rowKey?: string;
}>({});
type Prop = {
  columns: any;
  dataSource: any;
  onChange?: (newData: Array<any>) => void;
  rowKey: string;
};
interface EditableCellProps {
  title: React.ReactNode;
  editable: boolean;
  children: React.ReactNode;
  dataIndex: keyof any;
  record: any;
  inputType: string;
  prop: { options: Array<any> };
  editorConfig: (record: any) => void;
}
interface EditableRowProps {
  index: number;
  onChange?: (newData: Array<any>) => void;
}
const EditableRow: React.FC<EditableRowProps> = ({ index, ...props }) => {
  const [form] = Form.useForm();
  const { onChange, data, rowKey } = useContext(TableContext)!;
  return (
    <Form
      form={form}
      component={false}
      disabled={
        data?.find((item) => item[rowKey] === props[`data-row-key`])?.disabled
      }
      onValuesChange={() => {
        const newData = data?.map((item) => {
          if (item[rowKey] === props[`data-row-key`]) {
            return { ...item, ...form.getFieldsValue() };
          }
          return item;
        });
        onChange?.(newData);
      }}
    >
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell: React.FC<EditableCellProps> = ({
  children,
  editable,
  title,
  dataIndex,
  record,
  editorConfig,
  ...restProps
}) => {
  const form = useContext(EditableContext)!;
  let childNode = children;
  useEffect(() => {
    if (record) {
      form.setFieldsValue({ [dataIndex]: record[dataIndex] });
    }
  }, [record]);
  if (editable) {
    const { inputType, prop } = editorConfig(record);
    if (inputType === EditType.INPUT) {
      childNode = (
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
          <Input {...prop} />
        </Form.Item>
      );
    } else if (inputType === EditType.SELECT) {
      childNode = (
        <Form.Item style={{ margin: 0 }} name={dataIndex}>
          <Select {...prop} options={prop?.options} />
        </Form.Item>
      );
    } else {
      childNode = <>{children}</>;
    }
  }
  return <td {...restProps}> {childNode}</td>;
};

export const EditTable: React.FC<Prop & TableProps<RecordType>> = ({
  columns,
  dataSource,
  onChange,
  rowKey,
  ...props
}) => {
  const data = cloneDeep(dataSource);
  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const editColumns = cloneDeep(columns).map((col: EditableCellProps) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        editorConfig: col.editorConfig,
      }),
    };
  });
  return (
    <TableContext.Provider value={{ data, onChange, rowKey }}>
      <Table
        columns={editColumns}
        dataSource={data}
        components={components}
        rowKey={rowKey}
        {...props}
        className={styles[`table-container`]}
      />
    </TableContext.Provider>
  );
};
