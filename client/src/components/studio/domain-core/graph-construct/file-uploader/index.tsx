import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Upload, UploadFile } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { isEmpty, map } from 'lodash';
import { DataType, FileData } from '../../../interface/import';
import { GraphData } from '../../../interface/schema';
import { getFileSizeTransform } from '../../../utils/getFileSizeTransform';
import { parseCsv } from '../../../utils/parseCsv';
import {
  cascaderOptionsTransform,
  mergeFileDataList,
} from '../../../utils/uploadFile';

const { Dragger } = Upload;

export interface FileUploaderProps {
  fileDataList: FileData[];
  graphData: GraphData;
  setFileDataList?: (files: FileData[]) => void;
  type?: 'text' | 'drop';
}

export const FileUploader = (props: FileUploaderProps) => {
  const {
    type = 'drop',
    fileDataList = [],
    setFileDataList,
    graphData,
  } = props;
  let currentFileDataList = fileDataList;

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

  const handleFileFormate = async (file: UploadFile<any>) => {
    const { name, originFileObj, size, status } = file;
    let fileResult = {
      fileName: name,
      formateSize: getFileSizeTransform(size),
      data: null,
      status: 'processing',
    } as FileData;

    if (status === 'done') {
      const fileData = (await parseCsv(originFileObj)) as string[][];
      const { columns, dataSource } = tableDataTransform(
        fileData?.splice(0, 5),
      );
      const labelOptions = cascaderOptionsTransform(graphData);
      fileResult = {
        fileName: name,
        status: 'success',
        data: {
          columns,
          dataSource,
        },
        file: originFileObj,
        formateSize: getFileSizeTransform(size),
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
        formateSize: getFileSizeTransform(size),
      };
    }
    currentFileDataList = mergeFileDataList(currentFileDataList, fileResult);

    setFileDataList?.(currentFileDataList);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    maxCount: 1,
    accept: '.csv',
    customRequest(options) {
      // @ts-ignore
      options.onSuccess(options.filename);
    },
    onChange(info) {
      const { file } = info;
      handleFileFormate(file);
    },
    showUploadList: false,
  };

  return (
    <>
      {type === 'drop' ? (
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined style={{ color: '#1650FF' }} />
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
