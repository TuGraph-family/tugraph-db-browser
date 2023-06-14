import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Upload,
  message,
} from 'antd';
import { FormInstance } from 'antd/es/form';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { map } from 'lodash';
import React from 'react';
import { useImmer } from 'use-immer';
import {
  PUBLIC_PERFIX_CLASS,
  STORED_OPTIONS,
  STROED_TYPE,
} from '../../../../../../constant';

import styles from './index.module.less';

type Prop = {
  form: FormInstance<any>;
  visible: boolean;
  onCancel: () => void;
};
type Options =
  | {
      label: string;
      options: {
        value: string;
        label: string;
      }[];
    }[]
  | undefined;
const { Item } = Form;
const { Group } = Radio;
export const StoredForm: React.FC<Prop> = ({ form, visible, onCancel }) => {
  const [state, updateState] = useImmer<{ demoVisible: boolean }>({
    demoVisible: false,
  });
  const { demoVisible } = state;
  const props: UploadProps = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success('文件上传成功');
      } else if (info.file.status === 'error') {
        message.error('文件上传失败');
      }
    },
  };
  // 处理OptGroup数据
  const options = (options: Options) => {
    return map(options, (option) => {
      if (option.options) {
        return {
          ...option,
          options: map(option.options, (item) => ({
            ...item,
            label: (
              <>
                <div>{item.label}</div>
                <a
                  onClick={() => {
                    updateState((draft) => {
                      draft.demoVisible = true;
                    });
                  }}
                >
                  dome下载
                </a>
              </>
            ),
          })),
        };
      }
      return option;
    });
  };
  return (
    <>
      <Modal
        title={'添加存储过程'}
        visible={visible}
        onCancel={onCancel}
        width={480}
        className={styles[`${PUBLIC_PERFIX_CLASS}-form`]}
        footer={
          <>
            <Button type="default">取消</Button>
            <Button type="primary">确定</Button>
          </>
        }
      >
        <Form form={form} layout="vertical">
          <Item
            label="存储过程名称"
            name="name"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="请输入" />
          </Item>
          <Item
            label="存储过程类型"
            name="type"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select options={options(STORED_OPTIONS)} />
          </Item>
          <Item label="存储过程描述" name="description">
            <Input.TextArea placeholder="请输入" />
          </Item>
          <Item
            label="是否只读"
            tooltip="执行时是否修改数据库"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Group>
              <Radio value={false}>否</Radio>
              <Radio value={true}>是</Radio>
            </Group>
          </Item>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
          <span>支持扩展名：.gql</span>
        </Form>
      </Modal>
      <Modal
        title="Demo下载"
        width={525}
        visible={demoVisible}
        onCancel={() => {
          updateState((draft) => {
            draft.demoVisible = false;
          });
        }}
      >
        <Form layout="vertical">
          <Item
            label="存储过程类型"
            tooltip
            required
            className={styles[`${PUBLIC_PERFIX_CLASS}-form-radio`]}
          >
            <Radio.Group defaultValue={'zip'}>
              {map(STROED_TYPE, (type) => (
                <Radio value={type.value} key={type.value}>
                  {type.label}
                </Radio>
              ))}
            </Radio.Group>
          </Item>
        </Form>
      </Modal>
    </>
  );
};
