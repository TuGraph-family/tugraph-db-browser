import { Form, Input, Modal } from 'antd';
import React from 'react';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';

import styles from './index.module.less';

type Prop = { open: boolean; onCancel: () => void };
const { Item } = Form;
const EditPasswordModal: React.FC<Prop> = ({ open, onCancel }) => {
  return (
    <Modal
      title="修改密码"
      okText="确定"
      cancelText="取消"
      width={560}
      className={styles[`${PUBLIC_PERFIX_CLASS}-edit-password-modal`]}
      open={open}
      onCancel={onCancel}
    >
      <Form layout="vertical">
        <Item label="请输入原密码" rules={[{ required: true, message: '请输入' }]} name="oldPassword">
          <Input />
        </Item>
        <Item label="请输入新密码" rules={[{ required: true, message: '请输入' }]} name="newPassword">
          <Input />
        </Item>
        <Item label="再次输入新密码" rules={[{ required: true, message: '请输入' }]} name="againPassword">
          <Input />
        </Item>
      </Form>
    </Modal>
  );
};
export default EditPasswordModal;
