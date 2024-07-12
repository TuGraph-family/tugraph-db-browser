import { Button, Form, Input, Space, Tooltip, message } from 'antd';
import { isEmpty, join } from 'lodash';
import React, { useCallback, useState } from 'react';
import { useImmer } from 'use-immer';
import IconFont from '@/components/studio/components/icon-font';
import SwitchDrawer from '@/components/studio/components/switch-drawer';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';
import { useImport } from '@/components/studio/hooks/useImport';
import { useVisible } from '@/components/studio/hooks/useVisible';
import { FileData } from '@/components/studio/interface/import';
import { GraphData } from '@/components/studio/interface/schema';
import { fileSchemaTransform } from '@/components/studio/utils/dataImportTransform';
import { FileUploader } from '../file-uploader';
import { ImportDataConfig } from '../import-data-config';
import { ImportDataResult } from '../import-data-result';

import { ArrowLeftOutlined } from '@ant-design/icons';
import styles from './index.module.less';

type Prop = {
  graphName: string;
  graphData: GraphData;
  onSwitch?: (onShow, onClose) => void;
};

export const ImportData: React.FC<Prop> = ({
  graphName,
  graphData,
  onSwitch,
}) => {
  const [form] = Form.useForm();
  const { onImportData, importDataLoading } = useImport();
  const { visible, onShow, onClose } = useVisible({ defaultVisible: true });
  const [fileDataList, setFileDataList] = useState<FileData[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [state, updateState] = useImmer<{
    resultStatus: string;
    resultData: any;
    errorMessage: string;
    isFullView: boolean;
    uploadLoading: boolean;
    taskId?: string;
  }>({
    resultStatus: 'loading',
    errorMessage: '',
    isFullView: false,
    uploadLoading: false,
    taskId: '',
    resultData: {},
  });
  const {
    resultStatus,
    errorMessage,
    isFullView,
    taskId,
    uploadLoading,
    resultData,
  } = state;

  // 获取点类型
  const getType = (graph:GraphData, name: string) => {
    const { primaryField, properties } = graph?.nodes?.find(
      itemNode => itemNode?.labelName === name,
    ) || {};
    const type = properties?.find(
      itemType => itemType?.name === primaryField,
    );
    return type || {}
  };

  const onImport = () => {
    const isLengthNotMatch = fileDataList.every((fileData: FileData) => {
      const {
        selectedValue,
        fileSchema: { columns = [], DST_ID, SRC_ID },
      } = fileData || {};
      const fileSchemaColumnsLength =
        columns?.filter((item: any) => item).length || 0;
      const AdditionalForm =
        selectedValue?.[0] === 'edge' ? !!(DST_ID && SRC_ID) : true;
      return (
        fileSchemaColumnsLength &&
        columns.every((item: any) => item) &&
        AdditionalForm
      );
    });

    if (!isLengthNotMatch) {
      return message.error(`请完成所有列的映射`);
    }
   
    fileDataList.forEach((item: any) => {
      item.fileSchema.columns = [...item?.fileSchema?.columns].filter(
        item => item,
      );
      if (item?.selectedValue?.[0] === 'edge') {
        const newProperties = [];
        const { DST_ID, SRC_ID,properties } = item?.fileSchema || {};
        if (DST_ID === SRC_ID) {
          // 相等只需要取一个类型
          const type = getType(graphData,DST_ID)
          newProperties.push(
            { ...type, name: 'SRC_ID' },
            { ...type, name: 'DST_ID' },
          );
        } else {
          // 不相等取两个类型
          newProperties.push(
            { ...getType(graphData,SRC_ID), name: 'SRC_ID' },
            { ...getType(graphData,DST_ID), name: 'DST_ID' },
          );
        }
        item.fileSchema.properties = newProperties.concat(properties)
      }
    });

    form.validateFields().then(async val => {
      if (isEmpty(fileDataList)) {
        message.error('请先上传文件');
        return;
      }
     

      // 1. 导入数据
      const params = {
        graphName, //导入的子图名称
        files: fileSchemaTransform(fileDataList),
        delimiter: val?.delimiter, //数据分隔符
      };

    

      onImportData(params).then(res => {
        if (res?.success) {
          updateState(draft => {
            draft.resultStatus = 'success';
            draft.resultData = res?.data || {};
          });
        } else {
          updateState(draft => {
            draft.resultStatus = 'error';
            draft.errorMessage = res.errorMessage;
          });
          message.error('上传失败' + res.errorMessage);
        }
        setShowResult(true);
      });
    });
  };

  const onFullView = useCallback(() => {
    updateState(draft => {
      draft.isFullView = !isFullView;
    });
  }, [isFullView]);

  if (showResult) {
    return (
      <SwitchDrawer
        visible={visible}
        onShow={onShow}
        onClose={onClose}
        position="right"
        width={593}
        className={styles[`${PUBLIC_PERFIX_CLASS}-container`]}
      >
        <ImportDataResult
          status={resultStatus}
          data={resultData}
          errorMessage={errorMessage}
          setShowResult={setShowResult}
          graphName={graphName}
          setFileDataList={setFileDataList}
        />
      </SwitchDrawer>
    );
  } else {
    return (
      <SwitchDrawer
        visible={visible}
        onShow={onShow}
        onClose={onClose}
        position="right"
        width={593}
        className={styles[`${PUBLIC_PERFIX_CLASS}-container`]}
        footer={
          <>
            <Button
              style={{ marginRight: 12 }}
              onClick={() => {
                onClose();
                form.resetFields();
              }}
            >
              取消
            </Button>
            <Button
              loading={uploadLoading || importDataLoading}
              onClick={onImport}
            >
              导入
            </Button>
          </>
        }
      >
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-content`]}>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-header`]}>
            <span>数据导入</span>
            <div>
              命令行导入
              <a
                href="https://tugraph-db.readthedocs.io/zh-cn/latest/6.utility-tools/1.data-import.html"
                target="_blank"
              >
                参见文档
              </a>
            </div>
          </div>
          <div>
            <Form layout="vertical" form={form}>
              <Form.Item
                // rules={[{ required: true, message: `请输入分隔符` }]}
                label={`分割符`}
                name={'delimiter'}
              >
                <Input placeholder={`请输入分隔符`} />
              </Form.Item>
            </Form>

            <div
              className={
                isFullView
                  ? styles[`${PUBLIC_PERFIX_CLASS}-container-full`]
                  : null
              }
            >
              <div
                className={join(
                  [
                    styles[`${PUBLIC_PERFIX_CLASS}-container-header`],
                    ...(isFullView
                      ? [styles[`${PUBLIC_PERFIX_CLASS}-container-header-full`]]
                      : []),
                  ],
                  ' ',
                )}
              >
                {isFullView && (
                  <div>
                    <ArrowLeftOutlined onClick={onFullView} />
                    <span>数据对应表</span>
                  </div>
                )}
                {!isFullView && <span>数据对应表</span>}
                {!isEmpty(fileDataList) && (
                  <Space size={16}>
                    {/* <FileUploader
                      graphData={graphData}
                      type="text"
                      setFileDataList={setFileDataList}
                      fileDataList={fileDataList}
                    /> */}
                    {!isFullView && (
                      <Tooltip title={'全屏显示'}>
                        <IconFont
                          style={{ fontSize: '24px' }}
                          size={24}
                          type={'icon-quanping'}
                          onClick={onFullView}
                        />
                      </Tooltip>
                    )}
                  </Space>
                )}
              </div>
              <div
                style={
                  !isEmpty(fileDataList)
                    ? { display: 'none' }
                    : { display: 'block' }
                }
              >
                <FileUploader
                  graphData={graphData}
                  setFileDataList={setFileDataList}
                  fileDataList={fileDataList}
                />
              </div>

              <ImportDataConfig
                graphData={graphData}
                fileDataList={fileDataList}
                setFileDataList={setFileDataList}
                isFullView={isFullView}
              />
            </div>
          </div>
        </div>
      </SwitchDrawer>
    );
  }
};
