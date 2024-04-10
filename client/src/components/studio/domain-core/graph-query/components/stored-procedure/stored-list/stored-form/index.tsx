import { QuestionCircleOutlined, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
  Space,
  Upload,
  UploadProps,
  message,
} from 'antd';
import { FormInstance } from 'antd/es/form';
import { UploadChangeParam, UploadFile } from 'antd/lib/upload';
import { includes, map, cloneDeep } from 'lodash';
import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import {
  CPP_CODE_TYPE,
  PUBLIC_PERFIX_CLASS,
  STORED_OPTIONS,
} from '../../../../../../constant';
import { useProcedure } from '../../../../../../hooks/useProcedure';
import { StoredDownLoad } from '../../stored-download';

import styles from './index.module.less';

type ContentObject = {
  uid?: string;
  fileName: string;
  content: string;
};

type Prop = {
  form: FormInstance<any>;
  visible: boolean;
  onCancel: () => void;
  graphName: string;
  refreshList: (type: 'cpp' | 'python' | 'all') => any;
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
  const uploadRef = useRef(null);
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
    beforeUpload: async file => {
      const reader = new FileReader();
      const fileName = file.name;
      const uid = file.uid;
      await reader.readAsText(file);
      const copyContent = cloneDeep(state.content);
      reader.onload = result => {
        try {
          const content = btoa(`${result?.target?.result}`);
          updateState(draft => {
            const hasIndex = draft.content.findIndex(
              item => item.uid === uid || item?.fileName === fileName,
            );

            const newItem = {
              uid,
              content,
              fileName,
            };
            if (hasIndex === -1) {
              draft.content = [...draft.content, newItem];
            } else {
              copyContent[hasIndex] = newItem;
              draft.content = copyContent;
            }
          });
        } catch (err: any) {
          message.error(err);
        }
      };
    },
    onRemove: file => {
      updateState(draft => {
        draft.content = draft.content.filter(
          item => item.uid !== file.uid || item?.fileName !== file.name,
        );
      });
    },
  };
  const [state, updateState] = useImmer<{
    demoVisible: boolean;
    content: ContentObject[];
    demoValue: string;
    isPy: boolean;
    isCpp: boolean;
    uploadProps: UploadProps;
  }>({
    demoVisible: false,
    content: [],
    demoValue: 'cpp_v1',
    isPy: false,
    isCpp: false,
    uploadProps: props,
  });
  const { demoVisible, content, demoValue, isPy, isCpp } = state;

  // 取消新增储存过程
  const cancelUpdate = () => {
    updateState(draft => {
      draft.content = [];
    });
    onCancel();
    form.resetFields();
  };
  // 处理OptGroup数据
  const options = (options: Options) => {
    return map(options, (option: { options: any }) => {
      if (option.options) {
        return {
          ...option,
          options: map(
            option.options,
            (item: {
              label:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | Iterable<React.ReactNode>
                | React.ReactPortal
                | null
                | undefined;
              value: string;
            }) => ({
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
                  {(item.value === 'cpp' || item.value === 'py') && (
                    <a
                      onClick={() => {
                        updateState(draft => {
                          draft.demoVisible = true;
                        });
                      }}
                    >
                      demo下载
                    </a>
                  )}
                </div>
              ),
            }),
          ),
        };
      }
      return option;
    });
  };
  // 新增存储过程
  const uploadProcedure = () => {
    form.validateFields().then(val => {
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
        content: state.content.map(item => {
          return item?.content;
        }),
        file_name: state.content.map(item => {
          return item?.fileName;
        }),
      }).then(res => {
        if (res.errorCode === '200') {
          message.success('新增成功');
          updateState(draft => {
            draft.content = [];
          });
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
        title={'新建存储过程'}
        visible={visible}
        onCancel={onCancel}
        width={480}
        destroyOnClose
        className={styles[`${PUBLIC_PERFIX_CLASS}-form`]}
        footer={
          <>
            <Button type="default" onClick={cancelUpdate}>
              取消
            </Button>
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
            <Select
              onSelect={val => {
                updateState(draft => {
                  switch (val) {
                    case 'val':
                      draft.isPy = true;
                      form.setFieldsValue({ version: 'v1' });
                      break;
                    case 'cpp':
                      draft.isCpp = true;
                      draft.uploadProps.maxCount = 999;
                      break;
                    default:
                      draft.isPy = false;
                      draft.isCpp = false;
                      draft.uploadProps.maxCount = 1;
                      break;
                  }
                });
              }}
              options={options(STORED_OPTIONS)}
            />
          </Item>

          <Item label="存储过程描述" name="description">
            <Input.TextArea placeholder="请输入" />
          </Item>
          <Item
            label={
              <Space>
                <span>版本</span>
                <Popover
                  content={
                    <>
                      <img
                        className={styles[`${PUBLIC_PERFIX_CLASS}-popover-img`]}
                        src={
                          'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*BaEiS4MQPpYAAAAAAAAAAAAADgOBAQ/originall'
                        }
                        alt=""
                      />
                    </>
                  }
                >
                  <QuestionCircleOutlined
                    style={{ color: 'rgba(147,147,152,1)' }}
                  />
                </Popover>
              </Space>
            }
            name="version"
            rules={[{ required: true, message: '请选择' }]}
            className={styles[`${PUBLIC_PERFIX_CLASS}-readonly-horizontal`]}
          >
            <Group>
              <Radio value={'v1'}>v1</Radio>
              <Radio disabled={isPy} value={'v2'}>
                v2
              </Radio>
            </Group>
          </Item>

          <Item
            label="执行时是否修改数据库"
            name="readonly"
            rules={[{ required: true, message: '请选择' }]}
            className={styles[`${PUBLIC_PERFIX_CLASS}-readonly-horizontal`]}
          >
            <Group>
              <Radio value={false}>否</Radio>
              <Radio value={true}>是</Radio>
            </Group>
          </Item>

          <Upload {...state.uploadProps} ref={uploadRef}>
            <Button icon={<UploadOutlined />}>上传文件</Button>
          </Upload>
        </Form>
      </Modal>
      <StoredDownLoad
        demoVisible={demoVisible}
        onCancel={() => {
          updateState(draft => {
            draft.demoVisible = false;
          });
        }}
      />
    </>
  );
};
