import { UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Select,
  Upload,
  UploadProps,
  message,
} from 'antd';
import { FormInstance } from 'antd/es/form';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { includes, map } from 'lodash';
import React from 'react';
import { useImmer } from 'use-immer';
import {
  CPP_CODE_TYPE,
  PUBLIC_PERFIX_CLASS,
  STORED_OPTIONS,
} from '../../../../../../constant';
import { useProcedure } from '../../../../../../hooks/useProcedure';
import { StoredDownLoad } from '../../stored-download';

import styles from './index.module.less';

type Prop = {
  form: FormInstance<any>;
  visible: boolean;
  onCancel: () => void;
  graphName: string;
  refreshList: (type: 'cpp' | 'python' | 'all') => void;
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
export const StoredForm: React.FC<Prop> = ({
  form,
  visible,
  onCancel,
  graphName,
  refreshList,
}) => {
  const { onUploadProcedure, UploadProcedureLoading } = useProcedure();
  const [state, updateState] = useImmer<{
    demoVisible: boolean;
    content: string;
    demoValue: string;
  }>({
    demoVisible: false,
    content: '',
    demoValue: 'cpp_v1',
  });
  const { demoVisible, content, demoValue } = state;
  const props: UploadProps = {
    name: 'file',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info: UploadChangeParam<UploadFile<any>>) {
      if (info.file.status === 'done') {
        message.success('文件上传成功');
      } else if (info.file.status === 'error') {
        message.error('文件上传失败');
      }
    },
    maxCount: 1,
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (result) => {
        updateState((draft) => {
          draft.content = result.target?.result as string;
        });
      };
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
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                }}
              >
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
              </div>
            ),
          })),
        };
      }
      return option;
    });
  };
  // 新增存储过程
  const uploadProcedure = () => {
    form.validateFields().then((val) => {
      let procedureType: 'cpp' | 'python';
      if (includes(CPP_CODE_TYPE, val.codeType)) {
        procedureType = 'cpp';
      } else {
        procedureType = 'python';
      }
      onUploadProcedure({
        ...val,
        graphName,
        procedureType,
        content: btoa(content),
      }).then((res) => {
        if (res.errorCode === '200') {
          message.success('新增成功');
          onCancel();
          form.resetFields();
          refreshList(procedureType);
        }
      });
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
            <Button
              loading={UploadProcedureLoading}
              type="primary"
              onClick={uploadProcedure}
            >
              确定
            </Button>
          </>
        }
      >
        <Form form={form} layout="vertical">
          <Item
            label="存储过程名称"
            name="procedureName"
            rules={[{ required: true, message: '请输入' }]}
          >
            <Input placeholder="请输入" />
          </Item>
          <Item
            label="存储过程类型"
            name="codeType"
            rules={[{ required: true, message: '请选择' }]}
          >
            <Select options={options(STORED_OPTIONS)} />
          </Item>

          <Item label="存储过程描述" name="description">
            <Input.TextArea placeholder="请输入" />
          </Item>
          <Row>
            <Col span={12}>
              <Item
                label="版本"
                name="version"
                rules={[{ required: true, message: '请选择' }]}
                className={styles[`${PUBLIC_PERFIX_CLASS}-readonly`]}
              >
                <Group>
                  <Radio value={'v1'}>v1</Radio>
                  <Radio value={'v2'}>v2</Radio>
                </Group>
              </Item>
            </Col>
            <Col span={12}>
              <Item
                label="是否只读"
                name="readonly"
                tooltip="执行时是否修改数据库"
                rules={[{ required: true, message: '请选择' }]}
                className={styles[`${PUBLIC_PERFIX_CLASS}-readonly`]}
              >
                <Group>
                  <Radio value={false}>否</Radio>
                  <Radio value={true}>是</Radio>
                </Group>
              </Item>
            </Col>
          </Row>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
          <div
            style={{
              fontWeight: 400,
              color: 'rgba(152,152,157,1)',
              marginTop: 4,
            }}
          >
            支持扩展名：.gql
          </div>
        </Form>
      </Modal>
      <StoredDownLoad
        demoVisible={demoVisible}
        onCancel={() => {
          updateState((draft) => {
            draft.demoVisible = false;
          });
        }}
      />
    </>
  );
};
