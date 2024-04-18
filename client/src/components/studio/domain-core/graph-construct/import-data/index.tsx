import { Button, Form, Input, Space, Tooltip, message } from 'antd';
import { filter, find, isEmpty, join, map } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import IconFont from '../../../components/icon-font';
import SwitchDrawer from '../../../components/switch-drawer';
import { PUBLIC_PERFIX_CLASS } from '../../../constant';
import { useImport } from '../../../hooks/useImport';
import { useVisible } from '../../../hooks/useVisible';
import { FileData } from '../../../interface/import';
import { GraphData } from '../../../interface/schema';
import { uploadFile } from '../../../services/FileController';
import { getLocalData, setLocalData } from '../../../utils';
import {
  fileSchemaTransform,
  mergeTaskInfo,
} from '../../../utils/dataImportTransform';
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
  const onImportProgressSuccess = (res: any) => {
    if (res.errorCode == '200') {
      if (res?.data?.state === '2') {
        importProgressCancel();
        const taskList = getLocalData('TUGRAPH_INFO');
        const newTaskInfo = filter(
          taskList,
          (info: any) => info.taskId !== taskId,
        );
        setLocalData('TUGRAPH_INFO', newTaskInfo);
        updateState(draft => {
          draft.resultStatus = 'success';
          draft.errorMessage = '';
        });
      } else if (res?.data?.state === '1') {
        updateState(draft => {
          draft.resultStatus = 'loading';
          draft.errorMessage = '';
        });
      } else {
        importProgressCancel();
        updateState(draft => {
          draft.resultStatus = 'error';
          draft.errorMessage = res?.data?.reason;
        });
      }
    } else {
      importProgressCancel();
      updateState(draft => {
        draft.resultStatus = 'error';
        draft.errorMessage = res.errorMessage || res?.data?.reason;
      });
    }
  };
  const {
    onImportData,
    importDataLoading,
    onImportProgress,
    importProgressCancel,
  } = useImport({ onImportProgressSuccess });
  const { visible, onShow, onClose } = useVisible({ defaultVisible: true });
  const [fileDataList, setFileDataList] = useState<FileData[]>([]);
  const [showResult, setShowResult] = useState<boolean>(false);
  const [state, updateState] = useImmer<{
    resultStatus: string;
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
  });
  const { resultStatus, errorMessage, isFullView, taskId, uploadLoading } =
    state;

  useEffect(() => {
    if (!taskId || resultStatus === 'success' || resultStatus === 'error') {
      importProgressCancel();
      return;
    }
    onImportProgress(taskId);
  }, [taskId]);

  useEffect(() => {
    onSwitch?.(onShow, onClose);

    const taskList = getLocalData('TUGRAPH_INFO') ?? [];
    const taskId = find(taskList, item => item.graphName === graphName)?.taskId;
    if (taskId) {
      updateState(draft => {
        draft.taskId = taskId;
      });
      setShowResult(true);
    }
  }, []);

  const uploadChunk = async (
    fileName: string,
    fileSize: number,
    file: any,
    beginPos: number,
  ) => {
    return await uploadFile(
      {
        'File-Name': fileName,
        Size: `${fileSize}`,
        'Begin-Pos': `${beginPos}`,
      },
      file,
    );
  };

  const handleChuckUpload = async (fileData: FileData) => {
    const { fileName, file } = fileData;
    // 上传文件的分片大小 (1MB)
    const chunkSize = 1024 * 100;
    let start = 0;
    const size = Number(file?.size);
    if (size <= chunkSize) {
      return uploadChunk(fileName, size, file, 0);
    } else {
      const promise: Promise<any>[] = [];
      while (start < size) {
        // 计算该分片的结束位置
        const end = start + chunkSize;
        const chunk = file?.slice(start, end);
        const chunSize = chunk?.size ?? 0;

        // 上传该分片
        promise.push(await uploadChunk(fileName, chunSize, chunk, start));
        start = end;
      }
      return promise;
    }
  };

  const onImport = () => {
    const isLengthNotMatch = fileDataList.every((fileData: any) => {
      const fileSchemaColumnsLength =
        fileData?.fileSchema?.columns?.filter((item: any) => item).length || 0;
      return (
        fileSchemaColumnsLength &&
        fileData?.fileSchema?.columns.every((item: any) => item)
      );
    });
    if (!isLengthNotMatch) {
      return message.error(`请完成所有列的映射`);
    }
    fileDataList.forEach((item: any) => {
      item.fileSchema.columns = [...item?.fileSchema?.columns].filter(
        item => item,
      );
    });

    form.validateFields().then(async val => {
      if (isEmpty(fileDataList)) {
        message.error('请先上传文件');
        return;
      }
      const startTime = Date.now(); // 记录开始时间
      updateState(draft => {
        draft.uploadLoading = true;
      });
      // 1. 上传文件
      const uploadPromise = map(fileDataList, async (fileData: FileData) => {
        return await handleChuckUpload(fileData);
      });

      try {
        const results = await Promise.all(uploadPromise);
        const hasError = results.some(
          (result: { errorMessage: any }) => result.errorMessage,
        );
        updateState(draft => {
          draft.uploadLoading = false;
        });
        if (hasError) {
          message.error('上传失败');
          return;
        }
      } catch (error) {
        updateState(draft => {
          draft.uploadLoading = false;
        });
        message.error(`请求返回错误:${error}`);
        return;
      }
      const endTime = Date.now(); // 记录全部请求结束的时间
      const totalDuration = endTime - startTime; // 计算总耗时
      console.log(`总共耗时: ${totalDuration}ms`);

      // 2. 导入数据
      const params = {
        graph: graphName, //导入的子图名称
        delimiter: val.delimiter, //数据分隔符
        continueOnError: false, //遇到错误时是否跳过错误数据并继续导入
        skipPackages: '0', //跳过的包个数
        flag: '1', // flag = 1时导入成功将删除数据文件
        schema: {
          files: fileSchemaTransform(fileDataList),
        },
      };

      onImportData(params).then(res => {
        if (res.errorCode == 200) {
          const taskId = res?.data?.taskId;
          mergeTaskInfo(taskId, graphName);
          updateState(draft => {
            draft.resultStatus = 'loading';
            draft.taskId = taskId;
          });
        } else {
          updateState(draft => {
            draft.resultStatus = 'error';
            draft.errorMessage = res.errorMessage;
          });
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
          errorMessage={errorMessage}
          setShowResult={setShowResult}
          graphName={graphName}
          taskId={taskId}
          importProgressCancel={importProgressCancel}
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
                rules={[{ required: true, message: `请输入分隔符` }]}
                label={`分割符`}
                required
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
                    <FileUploader
                      graphData={graphData}
                      type="text"
                      setFileDataList={setFileDataList}
                      fileDataList={fileDataList}
                    />
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
