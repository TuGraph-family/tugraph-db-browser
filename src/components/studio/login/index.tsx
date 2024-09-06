/**
 * file: login page
 * author: Allen
 */

import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { Button, Form, Input, Modal, Select, message } from 'antd';
import { useEffect } from 'react';
import { loadFull } from 'tsparticles';
import { useModel } from 'umi';
// constants
import {
  TUGRAPH_HISTORY_URI,
  TUGRAPH_PASSWORD,
  TUGRAPH_URI,
  TUGRAPH_USER_NAME,
} from '@/constants';
import { PUBLIC_PERFIX_CLASS } from '../constant';

// utils
import { loginDB } from '@/utils';
import { getLocalData } from '../utils/localStorage';

// style
import { dbRecordsTranslator } from '@/translator';
import { useImmer } from 'use-immer';
import styles from './index.module.less';
import particlesOptions from './particles-config';

const { Option } = Select;

const { Item, useForm } = Form;
const { confirm } = Modal;

export const Login = () => {
  // state
  const { setInitialState } = useModel('@@initialState');
  const [state, setState] = useImmer<{ isLoading: boolean; protocol: string }>({
    isLoading: false,
    protocol: 'bolt://',
  });
  const { isLoading, protocol } = state;

  // props
  const [form] = useForm();
  const userName = getLocalData(TUGRAPH_USER_NAME);
  const password = getLocalData(TUGRAPH_PASSWORD);
  const uri = getLocalData(TUGRAPH_URI);

  const login = async () => {
    setState(draft => {
      draft.isLoading = true;
    });
    const values = await form.validateFields();

    if (values) {
      try {
        const { uri, userName, password } = values;
        const { session, dbConfig, driver } = await loginDB({
          uri,
          userName,
          password,
          protocol,
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
              setState(draft => {
                draft.isLoading = false;
              });
            },
          });
        } else {
          window.location.hash = '/home';
        }
      } catch (error: any) {
        setState(draft => {
          draft.isLoading = false;
        });
        message.error('登录失败，请检查数据库地址、用户名、密码是否正确');
      }
    }
  };

  /** 判断是否已经登录，若登录则跳转至首页 */
  if (userName && !isLoading) {
    window.location.hash = '/home';
    return;
  }

  /* 地址回填 */
  useEffect(() => {
    const hitoryUri = getLocalData(TUGRAPH_HISTORY_URI);
    if (hitoryUri) {
      const { uri, protocol = 'bolt://' } = hitoryUri || {};
      form.setFieldsValue({
        uri,
      });
      setState(draft => {
        draft.protocol = protocol;
      });
    }
  }, []);

  /** select change */
  const onSelectChange = (value: string) => {
    setState(draft => {
      draft.protocol = value;
    });
  };

  /** 渲染select */
  const renderAddonBefore = (
    <Select value={protocol} onChange={onSelectChange}>
      <Option value="bolt://">bolt://</Option>
    </Select>
  );
  useEffect(() => {
    initParticlesEngine(async engine => {
      await loadFull(engine);
    });
  }, []);
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-login-container`]}>
      <img
        src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*AbamQ5lxv0IAAAAAAAAAAAAADgOBAQ/original"
        alt="tugrap-logo"
        className={styles[`${PUBLIC_PERFIX_CLASS}-logo-img`]}
      />
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-login-container-left`]}>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-particles-container`]}>
          <Particles id="tsparticles" options={particlesOptions} />
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
                  message: '请输入数据库地址，示例:172.0.0.1:7687',
                },
              ]}
            >
              <Input
                addonBefore={renderAddonBefore}
                placeholder="数据库地址，示例:172.0.0.1:7687"
              />
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
