import { Cascader, Empty, Input, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { cloneDeep, isEmpty, map } from 'lodash';
import { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { PUBLIC_PERFIX_CLASS } from '../../../constant';
import { DataType, FileData, FileSchema } from '../../../interface/import';
import { GraphData } from '../../../interface/schema';
import {
  graphDataToOptions,
  nodesDataToOptions,
} from '../../../utils/dataImportTransform';

import styles from './index.module.less';

export interface DataMappingProps {
  fileDataList: FileData[];
  graphData: GraphData;
  currentFileData: FileData;
  setFileDataList?: (files: FileData[]) => void;
}

export const DataMapping = (prop: DataMappingProps) => {
  const {
    fileDataList = [],
    setFileDataList,
    graphData,
    currentFileData,
  } = prop;
  const [state, setState] = useImmer<{
    label: string;
    type: string;
    propertiesOptions: Array<{ label: string; value: string }>;
    nodesOptions: Array<{ label: string; value: string }>;
  }>({
    label: '',
    type: '',
    propertiesOptions: [],
    nodesOptions: [],
  });
  const { label, type, propertiesOptions, nodesOptions } = state;

  const handleInputChange = (vale: string, fileName: string) => {
    const newFileList = map(fileDataList, (fileData) => {
      const { header, ...res } = fileData.fileSchema;
      if (fileData.fileName === fileName) {
        return {
          ...fileData,
          fileSchema: {
            header: Number(vale),
            ...res,
          },
        };
      }
      return fileData;
    });
    setFileDataList(newFileList);
  };

  const handleLabelChange = (value: string[], fileName: string) => {
    const [labelType, labelName] = value || [];
    setState((draft) => {
      draft.type = labelType;
      draft.label = labelName;
    });
    const newFileList = map(fileDataList, (fileData) => {
      if (fileData.fileName !== fileName) {
        return fileData;
      }
      const { label, ...res } = cloneDeep(fileData.fileSchema);
      let newColumns = new Array(fileData?.data?.columns?.length).fill('');
      let newFileSchema: FileSchema;
      if (labelType === 'edge') {
        newColumns[0] = 'SRC_ID';
        newColumns[1] = 'DST_ID';
        newFileSchema = {
          ...res,
          label: labelName,
          columns: newColumns,
          SRC_ID: '',
          DST_ID: '',
        };
      } else {
        newFileSchema = {
          label: labelName,
          columns: newColumns,
          format: res.format,
          header: res.header,
          path: res.path,
        };
      }

      return { ...fileData, fileSchema: newFileSchema };
    });
    setFileDataList(newFileList);
  };

  const handlePropertyChange = (
    value: any,
    index: number,
    fileName: string,
    prefix = ''
  ) => {
    const updateFileData = (fileData: FileData) => {
      const { fileSchema, ...rest } = fileData;
      const { columns, ...fileSchemaRest } = fileSchema;

      if (prefix === '起点') {
        fileSchemaRest['SRC_ID'] = value;
      } else if (prefix === '终点') {
        fileSchemaRest['DST_ID'] = value;
      } else {
        columns[index] = value;
      }

      return {
        ...rest,
        fileSchema: {
          ...fileSchemaRest,
          columns,
        },
      };
    };

    const fileIndex = fileDataList.findIndex(
      (fileData) => fileData.fileName === fileName
    );
    const newFileDataList = [...fileDataList];
    newFileDataList[fileIndex] = updateFileData(fileDataList[fileIndex]);

    setFileDataList(newFileDataList);
  };

  const getTableHeader = (fileName: string, index: number) => {
    const selectProps = {
      style: { width: '100%' },
      allowClear: true,
      dropdownMatchSelectWidth: false,
    };

    const handleSelect = (val: any, prefix = '') => {
      handlePropertyChange(val, index, fileName, prefix);
    };
    let prefix = '';

    if (type === 'edge') {
      prefix = index === 0 ? '起点' : index === 1 ? '终点' : '';
    }

    const selectOptions = prefix ? nodesOptions : propertiesOptions;

    return (
      <Space className="table-space">
        {prefix && <span>{prefix}</span>}
        <Select
          {...selectProps}
          onSelect={(val) => handleSelect(val, prefix)}
          options={selectOptions}
        />
      </Space>
    );
  };

  const getColumns = (columns: ColumnsType<DataType>, fileName: string) => {
    return map(columns, (column, index) => {
      return {
        ...column,
        title: getTableHeader(fileName, index),
      };
    });
  };

  useEffect(() => {
    if (!type || !label || isEmpty(graphData)) {
      return;
    }
    setState((draft) => {
      draft.propertiesOptions = graphDataToOptions({ graphData, type, label });
    });
    if (type === 'edge' && !isEmpty(graphData?.nodes)) {
      setState((draft) => {
        draft.nodesOptions = nodesDataToOptions(graphData.nodes);
      });
    }
  }, [type, label]);

  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-collapse-table`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-collapse-table-header`]}>
        <Space size={6}>
          标签：
          <Cascader
            size="small"
            key="dataMap"
            options={currentFileData?.labelOptions}
            placeholder="请选择"
            onChange={(val: string[]) =>{
              handleLabelChange(val, currentFileData.fileName)}
            }
          />
        </Space>

        <div
          className={
            styles[`${PUBLIC_PERFIX_CLASS}-collapse-table-header-group`]
          }
        >
          <Space>
            从第
            <Input
              defaultValue={0}
              onChange={(val) =>
                handleInputChange(val.target.value, currentFileData.fileName)
              }
              size="small"
            />
            行，开始
          </Space>
        </div>
      </div>
      {isEmpty(currentFileData) ? (
        <Empty />
      ) : (
        <Table
          columns={getColumns(
            currentFileData?.data?.columns,
            currentFileData.fileName
          )}
          pagination={false}
          dataSource={currentFileData.data?.dataSource}
          scroll={{ x: true, y: 270 }}
        />
      )}
    </div>
  );
};
