/**
 * file: login page
 * author: Allen
 */

import { useCallback, useState } from 'react';
import { Button, Form, Input, Modal, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';
import { useModel } from 'umi';

// constants
import particlesOptions from './particles-config';
import { PUBLIC_PERFIX_CLASS } from '../constant';
import { TUGRAPH_PASSWORD, TUGRAPH_URI, TUGRAPH_USER_NAME } from '@/constants';

// utils
import { loginDB } from '@/utils';
import { getLocalData } from '../utils/localStorage';

// style
import styles from './index.module.less';
import { dbRecordsTranslator } from '@/translator';

const { Item, useForm } = Form;
const { confirm } = Modal;

export const Login = () => {
  // state
  const { setInitialState } = useModel('@@initialState');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // props
  const [form] = useForm();
  const userName = getLocalData(TUGRAPH_USER_NAME);
  const password = getLocalData(TUGRAPH_PASSWORD);
  const uri = getLocalData(TUGRAPH_URI);

  // function
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  const login = async () => {
    setIsLoading(true);
    const values = await form.validateFields();

    if (values) {
      try {
        const { uri, userName, password } = values;
        const { session, dbConfig, driver } = await loginDB({
          uri,
          userName,
          password,
        });
        setInitialState({
          driver,
          session,
          userInfo: {
            userName,
            password,
          },
          dbConfig,
        } as any);
        const res = await session.run(
          'CALL dbms.security.isDefaultUserPassword()',
        );
        const { isDefaultUserPassword } =
          dbRecordsTranslator(res)?.data[0] || {};

        if (isDefaultUserPassword) {
          confirm({
            title: '当前使用的密码为默认密码，存在安全风险，请前往修改密码！',
            okText: '修改密码',
            cancelText: '跳过',
            mask: false,
            onOk() {
              window.location.hash = '/reset';
            },
            onCancel() {
              window.location.hash = '/home';
            },
            afterClose() {
              setIsLoading(false);
            },
          });
        } else {
          window.location.hash = '/home';
        }
      } catch (error: any) {
        setIsLoading(false);
        message.error('登录失败，请检查数据库地址、用户名、密码是否正确');
      }
    }
  };

  /** 判断是否已经登录，若登录则跳转至首页 */
  if (userName && !isLoading) {
    window.location.hash = '/home';
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
            initialValues={{
              uri,
              userName,
              password,
            }}
          >
            <Item
              name="uri"
              rules={[
                {
                  required: true,
                  message: '请输入数据库地址，示例：bolt://127.0.0.1:7687',
                },
              ]}
            >
              <Input placeholder="数据库地址，示例：bolt://127.0.0.1:7687" />
            </Item>
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
            <Button type="primary" onClick={() => login()} loading={isLoading}>
              登录
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
