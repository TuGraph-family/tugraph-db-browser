import { Form, Input, Modal, message } from 'antd';
import React from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../constant';
import { useUser } from '../../hooks/useUser';

import styles from './index.module.less';

type Prop = { open: boolean; onCancel: () => void };
const { Item } = Form;
const EditPasswordModal: React.FC<Prop> = ({ open, onCancel }) => {
  const { onChangePassword, ChangePasswordLoading } = useUser();
  const [form] = Form.useForm();
  const handleChangePassword = () => {
    form.validateFields().then((val) => {
      const { curPassword, password, againPassword } = val;
      if (password === againPassword) {
        onChangePassword({ curPassword, password }).then((res) => {
          if (res.success) {
            message.success('密码修改成功');
            onCancel();
          }
        });
      } else {
        message.error('新密码不一致，请重新输入');
      }
    });
  };
  return (
    <Modal
      title="修改密码"
      okText="确定"
      cancelText="取消"
      width={560}
      className={styles[`${PUBLIC_PERFIX_CLASS}-edit-password-modal`]}
      open={open}
      onCancel={onCancel}
      onOk={handleChangePassword}
      confirmLoading={ChangePasswordLoading}
    >
      <Form layout="vertical" form={form}>
        <Item label="请输入原密码" rules={[{ required: true, message: '请输入' }]} name="curPassword">
          <Input.Password />
        </Item>
        <Item label="请输入新密码" rules={[{ required: true, message: '请输入' }]} name="password">
          <Input.Password />
        </Item>
        <Item label="再次输入新密码" rules={[{ required: true, message: '请输入' }]} name="againPassword">
          <Input.Password />
        </Item>
      </Form>
    </Modal>
  );
};
export default EditPasswordModal;
