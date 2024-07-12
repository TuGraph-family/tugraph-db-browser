import { Container } from '@/layouts';
import Nav from '@/layouts/nav';
import { CloseCircleFilled, CheckCircleFilled } from '@ant-design/icons';
import styles from './resetPassword.less';

import { Form, Popover, Input, Button, Progress, message } from 'antd';
import { FormItemProps, FormInstance } from 'antd';
import { useState } from 'react';
import { useUser } from '@/components/console/hooks/useUser';
import { setLocalData } from '@/utils';
import { TUGRAPH_PASSWORD, TUGRAPH_URI, TUGRAPH_USER_NAME } from '@/constants';
import { useModel } from 'umi';
import { InitialState } from '@/app';

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
    message: '您的密码必须至少为8个字符，其中包含数字，大小写字母，特殊字符',
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

  const levelMap = new Map<number, string>([
    [0, '#ff4d4f'],
    [1, '#ff4d4f'],
    [2, '#ffa000'],
    [3, '#52c41a'],
  ]);

  const [state, setState] = useState({
    level: '低',
    levelProgress: 0,
  });
  const Content = () => {
    return (
      <div className={styles?.checkContent}>
        <div className={styles?.checkProgress}>
          <Progress
            percent={!value ? 0 : 10 + 30 * state.levelProgress}
            strokeColor={levelMap.get(state.levelProgress)}
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
          } else {
            setState({
              level: '低',
              levelProgress: 0,
            });
          }
          onChange && onChange(e);
        }}
      />
    </Popover>
  );
};

const ResetPassword = () => {
  const { initialState } = useModel('@@initialState');
  const { driver} = initialState as InitialState;
  const [form] = useForm();
  const { onChangePassword, ChangePasswordLoading } = useUser();


/**
 * 当关闭数据库链接,清空localStorage缓存
 */
const onClose=()=>{
  setLocalData(TUGRAPH_USER_NAME, null);
  setLocalData(TUGRAPH_PASSWORD, null);
  setLocalData(TUGRAPH_URI, null);
  driver.close();
}
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
            if (res?.success) {
              onClose()
              message.success('密码修改成功');
              window.open(window.location.origin + '#/login', '_self');
            }
          });
        } else {
          message.error('新密码不一致，请重新输入');
        }
      })
      .catch(err => {});
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
