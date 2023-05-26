import React from 'react';
import { Upload, UploadFile } from 'antd';
import type { UploadProps } from 'antd';
import { map, isEmpty } from 'lodash';
import { parseCsv } from '../../../utils/parseCsv';
import { cascaderOptionsTransform, mergeFileDataList } from '../../../utils/uploadFile';
import { InboxOutlined } from '@ant-design/icons';
import { DataType, FileData } from '../../../interface/import';
import { ColumnsType } from 'antd/lib/table';
import { GraphData } from '../../../interface/schema';

const { Dragger } = Upload;

export interface FileUploaderProps {
  fileDataList: FileData[];
  graphData: GraphData;
  setFileDataList?: (files: FileData[]) => void;
  type?: 'text' | 'drop';
}

export const FileUploader = (props: FileUploaderProps) => {
  const { type = 'drop', fileDataList = [], setFileDataList, graphData } = props;

  const tableDataTransform = (list: string[][]) => {
    if (isEmpty(list)) {
      return {
        columns: [],
        dataSource: [],
      };
    }

    const columns = map(list[0], (_: string, index: number) => ({
      width: 200,
      dataIndex: `col${index}`,
      fixed: index === 0 ? 'left' : undefined,
    })) as ColumnsType<DataType>;

    const dataSource = map(list, (item: string[]) => {
      const dataItem: { [key: string]: string } = {};
      item.forEach((value: string, index: number) => {
        dataItem[`col${index}`] = value;
      });
      return dataItem;
    });

    return { columns, dataSource };
  };

  const handleFileFormate = async (file: UploadFile<any>, status: string) => {
    const { name, originFileObj, size } = file;
    let fileResult = {
      fileName: name,
      formateSize: `${(size / 1000).toFixed(2)} KB`,
      data: null,
      status: 'processing',
    } as FileData;
    if (status === 'done') {
      const fileData = (await parseCsv(originFileObj)) as string[][];
      const { columns, dataSource } = tableDataTransform(fileData);
      const labelOptions = cascaderOptionsTransform(graphData);
      fileResult = {
        fileName: name,
        status: 'success',
        data: {
          columns,
          dataSource,
        },
        file: originFileObj,
        formateSize: `${(size / 1000).toFixed(2)} KB`,
        labelOptions,
        fileSchema: {
          path: name,
          header: 0,
          columns: new Array(columns?.length).fill(''),
          label: '',
          format: 'CSV',
        },
      };
    } else if (status === 'error') {
      fileResult = {
        status: 'error',
        fileName: name,
        data: null,
        formateSize: `${(size / 1000).toFixed(2)} KB`,
      };
    }
    const newFileList = mergeFileDataList(fileDataList, fileResult);
    setFileDataList(newFileList);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    accept: '.csv',
    onChange(info) {
      const { status } = info.file;
      const { file } = info;
      handleFileFormate(file, status);
    },
    showUploadList: false,
  };

  return (
    <>
      {type === 'drop' ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
          <p className="ant-upload-hint">您可以通过 CSV 文件导入数据</p>
        </Dragger>
      ) : (
        <Upload {...uploadProps}>
          <a href="javascript:void(0)">文件上传</a>
        </Upload>
      )}
    </>
  );
};
