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
import { includes, map } from 'lodash';
import React from 'react';

// hooks
import { useProcedure } from '@/components/studio/hooks/useProcedure';
import { useModel } from 'umi';
import { useImmer } from 'use-immer';

// type
import { InitialState } from '@/app';
import { FormInstance } from 'antd/es/form';

// components
import { StoredDownLoad } from '@/components/studio/domain-core/graph-query/components/stored-procedure/stored-download';

// constants
import {
  CPP_CODE_TYPE,
  PUBLIC_PERFIX_CLASS,
  STORED_OPTIONS,
} from '@/components/studio/constant/index';

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
  const { initialState } = useModel('@@initialState');
  const { driver } = initialState as InitialState;
  const props: UploadProps = {
    name: 'file',
    accept: '.cpp,.py,.so',
    maxCount: 1,
    headers: {
      authorization: 'authorization-text',
    },
    beforeUpload(file: File) {
      const fileReader = (file: File) => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            try {
              const base64String = reader.result as string;
              /** 移除 data URL 前缀（如 "data:image/png;base64,"） */
              const base64Content = base64String.split(',')[1];
              resolve(base64Content);
            } catch (err: any) {
              reject(err);
              message.error(err.message);
            }
          };
          reader.onerror = error => reject(error);
        });
      };

      fileReader(file)
        .then(base64Data => {
          message.success('文件上传成功');
          updateState(draft => {
            /** 需要添加name: file.name这句代码，因为name是不可枚举属性，无法解构 */
            draft.fileLst = [
              { ...file, name: file.name, content: base64Data, status: 'done' },
            ];
          });
        })
        .catch(error => {
          console.error('Error reading file:', error);
          message.error('Failed to read file');
        });
      return false;
    },
  };
  const [state, updateState] = useImmer<{
    demoVisible: boolean;
    demoValue: string;
    isPy: boolean;
    isCpp: boolean;
    fileLst: any[];
    maxCount: number;
  }>({
    demoVisible: false,
    maxCount: 1,
    demoValue: 'cpp_v1',
    isPy: false,
    isCpp: false,
    fileLst: [],
  });
  const { demoVisible, fileLst, demoValue, isPy, isCpp } = state;

  // 取消新增储存过程
  const cancelUpdate = () => {
    updateState(draft => {
      draft.fileLst = [];
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
    const formatFileContent = (fileList: any[]) => {
      let formatMap: { [key: string]: string } = {};
      for (let file of fileList) {
        formatMap[file.name] = file.content;
      }
      return formatMap;
    };

    const result = formatFileContent(state.fileLst);

    form.validateFields().then(val => {
      let procedureType: 'CPP' | 'PY';
      if (includes(CPP_CODE_TYPE, val.codeType)) {
        procedureType = 'CPP';
      } else {
        procedureType = 'PY';
      }
      //TODO: By Allen
      onUploadProcedure(driver, {
        ...val,
        graphName,
        codeType: val.codeType,
        procedureType,
        content: formatFileContent(state.fileLst),
      }).then(res => {
        if (res.errorCode === '200' || res.success) {
          message.success('新增成功');
          updateState(draft => {
            draft.fileLst = [];
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
        open={visible}
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
                      draft.maxCount = 999;
                      break;
                    default:
                      draft.isPy = false;
                      draft.isCpp = false;
                      draft.maxCount = 1;
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
              <Radio value={true}>否</Radio>
              <Radio value={false}>是</Radio>
            </Group>
          </Item>

          <Upload {...props} maxCount={state.maxCount} fileList={state.fileLst}>
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
