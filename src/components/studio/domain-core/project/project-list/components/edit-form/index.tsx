import { DownOutlined } from '@ant-design/icons';
import { Col, Form, Input, InputNumber, Row } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import React from 'react';
import { useImmer } from 'use-immer';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';

import styles from './index.module.less';

type Prop = { form: FormInstance; type: 'edit' | 'add' };
const { Item } = Form;
const EditForm: React.FC<Prop> = ({ form, type }) => {
  const [state, upState] = useImmer<{ rotate?: number; isShow?: boolean }>({
    rotate: 0,
    isShow: true,
  });
  return (
    <>
      <Form layout="vertical" form={form}>
        <Item
          label="图名称"
          name="graphName"
          className={styles[`${PUBLIC_PERFIX_CLASS}-input`]}
          rules={[
            {
              required: true,
              validator: (_props, value) => {
                var reg = new RegExp('^[a-zA-Z0-9_\u4e00-\u9fa5]+$');
                if (!value) {
                  return Promise.reject('请填写图名称！');
                }
                if (!reg.test(value)) {
                  return Promise.reject('名称由中文、字母、数字、下划线组成。');
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input maxLength={20} showCount disabled={type === 'edit'} />
        </Item>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-input-text`]}>
          名称由中文、字母、数字、下划线组成。
        </div>
        <Item label="图描述" name="description">
          <Input.TextArea
            maxLength={50}
            placeholder="请输入图描述"
            showCount
            style={{ height: 120, resize: 'none' }}
          />
        </Item>
      </Form>
      <div>
        高级配置
        <DownOutlined
          rotate={state.rotate}
          onClick={() => {
            upState({
              rotate: (state.rotate || 0) + 180,
              isShow: !state.isShow,
            });
          }}
        />
      </div>
      {state.isShow && (
        <Form form={form}>
          <Row justify={'space-between'}>
            <Col span={12}>
              <Item
                initialValue={1024}
                label="最大存储空间"
                name="maxSizeGB"
                colon={false}
                required
              >
                <InputNumber addonAfter="GB" />
              </Item>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};
export default EditForm;
