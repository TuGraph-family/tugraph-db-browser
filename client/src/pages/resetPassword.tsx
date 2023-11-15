import { Container } from '@/layouts';
import Nav from '@/layouts/nav';
import { CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import styles from './resetPassword.less';

import { Form, Popover, Input, Button, Progress, message } from 'antd';
import { FormItemProps, FormInstance } from 'antd';
import { useState } from 'react';
import { useUser } from '@/components/studio/hooks/useUser';

const Item = Form.Item;
const useForm = Form.useForm;
const LEVEL_WEAK = /^(?=.{8}).*$/;
const LEVEL_MEDIUM = /^(?=.{8})(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d).*$/;
const LEVEL_STRONG =
  /^(?=.{8})(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[*?!&￥$%^#,./@";:><\[\]}{\-=+_\\|》《。，、？'‘“”~ `]).*$/;
const rules = [
  {
    message: '',
    pattern: new RegExp(LEVEL_WEAK),
  },
  {
    message: '',
    pattern: new RegExp(LEVEL_MEDIUM),
  },
  {
    message: '',
    pattern: new RegExp(LEVEL_STRONG),
  },
];
export interface PopoverCheckInputInterFace {
  onChange?: (value: any) => void;
  value?: any;
  itemProps?: FormItemProps;
  form?: FormInstance;
}

const PopoverCheckInput = (props: PopoverCheckInputInterFace) => {
  const { value, onChange, itemProps, form, ...otherProps } = props;
  const [state, setState] = useState({
    level: '低',
    levelProgress: 1,
  });
  const Content = () => {
    return (
      <div className={styles?.checkContent}>
        <div className={styles?.checkProgress}>
          <Progress
            percent={33.33 * state.levelProgress}
            status="success"
            showInfo={false}
          />
          <div className={styles?.checkLevel}>{state.level}</div>
        </div>
        <div className={styles?.checkLevelOption}>
          <div className={styles?.checkLevelOptionIcon}>
            {state.levelProgress < 1 ? (
              <CloseCircleFilled />
            ) : (
              <CheckCircleFilled />
            )}
          </div>
          <div className={styles?.checkLevelOptionText}>长度为 8-20 个字符</div>
        </div>
        <div className={styles?.checkLevelOption}>
          <div className={styles?.checkLevelOptionIcon}>
            {state.levelProgress < 2 ? (
              <CloseCircleFilled />
            ) : (
              <CheckCircleFilled />
            )}
          </div>
          <div className={styles?.checkLevelOptionText}>
            支持大小写字母、数字、特殊字符
          </div>
        </div>
        <div className={styles?.checkLevelOption}>
          <div className={styles?.checkLevelOptionIcon}>
            {state.levelProgress < 3 ? (
              <CloseCircleFilled />
            ) : (
              <CheckCircleFilled />
            )}
          </div>
          <div className={styles?.checkLevelOptionText}>至少包含三种</div>
        </div>
      </div>
    );
  };

  return (
    <Popover placement="right" title="" content={<Content />}>
      <Input.Password
        {...otherProps}
        maxLength={20}
        value={value}
        onChange={e => {
          if (LEVEL_STRONG.test(e.target.value)) {
            setState({
              level: '高',
              levelProgress: 3,
            });
          } else if (LEVEL_MEDIUM.test(e.target.value)) {
            setState({
              level: '中',
              levelProgress: 2,
            });
          } else if (LEVEL_WEAK.test(e.target.value)) {
            setState({
              level: '低',
              levelProgress: 1,
            });
          }
          onChange && onChange(e);
        }}
      />
    </Popover>
  );
};

const ResetPassword = () => {
  const [form] = useForm();
  const { onChangePassword, ChangePasswordLoading } = useUser();
  const handleChangePassword = () => {
    form
      .validateFields()
      .then(val => {
        const { oldPassword, newPassword, checkNewPassword } = val;

        if (newPassword === checkNewPassword) {
          onChangePassword({
            curPassword: oldPassword,
            password: newPassword,
          }).then(res => {
            if (res.success) {
              message.success('密码修改成功');
              window.open(window.location.origin + '/home', '_self');
            }
          });
        } else {
          message.error('新密码不一致，请重新输入');
        }
      })
      .catch(err => {
        console.log(err, 'err');
      });
  };

  return (
    <Container
      style={{
        background:
          'url(https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*KYg7RLxkDxwAAAAAAAAAAAAADgOBAQ/original) no-repeat center',
        backgroundSize: 'cover',
      }}
    >
      <Nav linkView={false} />
      <Form className={styles?.resetPasswordForm} form={form} layout="vertical">
        <div className={styles?.resetPasswordFormTitle}>修改密码</div>
        <Item
          label="请输入原密码"
          name="oldPassword"
          required={true}
          rules={rules}
          className={styles?.itemName}
        >
          <PopoverCheckInput />
        </Item>
        <Item
          label="请输入新密码"
          name="newPassword"
          required={true}
          className={styles?.itemName}
          rules={rules}
        >
          <PopoverCheckInput />
        </Item>
        <Item
          label="请再次输入新密码"
          name="checkNewPassword"
          required={true}
          className={styles?.itemName}
          rules={rules}
        >
          <PopoverCheckInput />
        </Item>
        <Button
          type="primary"
          className={styles?.resetPasswordButton}
          onClick={handleChangePassword}
          loading={ChangePasswordLoading}
        >
          确定
        </Button>
      </Form>
    </Container>
  );
};

export default ResetPassword;
