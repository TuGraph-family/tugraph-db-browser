import { Form, InputNumber, Space } from 'antd';
import React from 'react';
import styles from './index.less';

const LayoutFormXyInput: React.FC = () => {
  return (
    <Space size="small" className={styles.contain}>
      <Form.Item name="x" extra="x 坐标">
        <InputNumber size="small" style={{ width: 104 }} />
      </Form.Item>
      <Form.Item name="y" extra="y 坐标">
        <InputNumber size="small" style={{ width: 104 }} />
      </Form.Item>
    </Space>
  );
};

export default LayoutFormXyInput;
