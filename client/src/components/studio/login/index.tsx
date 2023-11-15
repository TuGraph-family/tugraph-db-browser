import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { history } from 'umi';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import { PUBLIC_PERFIX_CLASS } from '../constant';
import { useAuth } from '../hooks/useAuth';
import { setLocalData } from '../utils/localStorage';
import particlesOptions from './particles-config';

import styles from './index.module.less';

const { Item, useForm } = Form;

export const Login = () => {
  const [form] = useForm();
  const { onLogin, loginLoading } = useAuth();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const login = async () => {
    const values = await form.validateFields();
    if (values) {
      try {
        onLogin(values).then(res => {
          if (res.errorCode == 200) {
            setLocalData('TUGRAPH_USER_NAME', values.userName);
            setLocalData('TUGRAPH_TOKEN', res.data.authorization);
            message.success('登录成功！');
            if (res?.data?.default_password) {
              window.open(window.location.origin + '/resetPassword', '_self');
            } else {
              // 登录成功后跳转到首页
              window.open(window.location.origin + '/home', '_self');
            }
          } else {
            message.error('登录失败！' + res.errorMessage);
          }
        });
      } catch (error) {
        message.error(error ?? '登录失败！');
      }
    }
  };

  if (localStorage.getItem('TUGRAPH_TOKEN')) {
    // 已经登录过，则跳转到首页
    history.push('/home');
    return;
  }
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-login-container`]}>
      <img
        src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*AbamQ5lxv0IAAAAAAAAAAAAADgOBAQ/original"
        alt="tugrap-logo"
        className={styles[`${PUBLIC_PERFIX_CLASS}-logo-img`]}
      />
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-login-container-left`]}>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-particles-container`]}>
          <Particles
            id="tsparticles"
            init={particlesInit}
            options={particlesOptions}
          />
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-text`]}>
            <img
              src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*ASz1S5q2zRYAAAAAAAAAAAAADgOBAQ/original"
              alt="tugraph-slogan"
            ></img>
          </div>
        </div>
      </div>

      <div className={styles[`${PUBLIC_PERFIX_CLASS}-login-form`]}>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-logo`]}>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-account-login`]}>
            欢迎登录
          </div>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-login-desc`]}>
            请使用账号密码登录
          </div>
          <Form
            form={form}
            className={styles[`${PUBLIC_PERFIX_CLASS}-form-style`]}
          >
            <Item
              name="userName"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
              ]}
            >
              <Input placeholder="账号" />
            </Item>
            <Item
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            >
              <Input.Password
                placeholder="密码"
                iconRender={visible =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </Item>
            <Button
              type="primary"
              loading={loginLoading}
              onClick={() => login()}
            >
              登录
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
