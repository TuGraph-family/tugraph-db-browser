import { CaretDownOutlined } from '@ant-design/icons';
import { Badge, Button, Collapse, Popconfirm, Space, Tooltip } from 'antd';
import { filter, map } from 'lodash';
import { PUBLIC_PERFIX_CLASS } from '../../../constant';
import { FileData } from '../../../interface/import';
import { GraphData } from '../../../interface/schema';

import styles from './index.module.less';
import { useEffect, useState } from 'react';
import DataMap from './data-map';

const { Panel } = Collapse;

export interface ImportDataConfigProps {
  fileDataList: FileData[];
  graphData: GraphData;
  setFileDataList?: (files: FileData[]) => void;
  isFullView?: boolean;
}

export const fileListDataMap = ({
  fileDataList,
  isFullView,
  handleDelete,
  graphData,
  setFileDataList,
}: {
  fileDataList: any[];
  isFullView: boolean | undefined;
  handleDelete: (id: string) => void;
  graphData: any;
  setFileDataList: ((files: FileData[]) => void) | undefined;
}) => {
  return fileDataList.map((data, index) => {
    return (
      <Panel
        forceRender
        key={`${index}`}
        header={
          <Space>
            <>
              <div
                className={
                  isFullView
                    ? ''
                    : styles[`${PUBLIC_PERFIX_CLASS}-collapse-name`]
                }
              >
                文件名：
                <Tooltip title={isFullView ? '' : data?.fileName}>
                  {data?.fileName}
                </Tooltip>
              </div>
              <div
                className={
                  isFullView
                    ? ''
                    : styles[`${PUBLIC_PERFIX_CLASS}-collapse-size`]
                }
              >
                文件大小：
                <Tooltip title={isFullView ? '' : data?.formateSize}>
                  {data?.formateSize}
                </Tooltip>
              </div>
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-collapse-status`]}>
                读取结果：
                <Badge status={data?.status} text={data?.status} />
              </div>
            </>
          </Space>
        }
        extra={
          <Popconfirm
            overlayClassName={styles.popConfirmBox}
            title="确认要删除吗"
            onConfirm={() => handleDelete(data.fileName)}
            okText="确认"
            cancelText="取消"
          >
            <Button type="link" onClick={e => e.stopPropagation()}>
              删除
            </Button>
          </Popconfirm>
        }
      >
        <DataMap
          data={data}
          graphData={graphData}
          setFileDataList={setFileDataList}
          fileDataList={fileDataList}
        />
      </Panel>
    );
  });
};

export const ImportDataConfig = (prop: ImportDataConfigProps) => {
  const { fileDataList = [], setFileDataList, graphData, isFullView } = prop;
  const [openKey, setOpenKey] = useState<string[]>(['0']);

  const handleDelete = (fileName: string) => {
   
    const newFileList = filter(
      fileDataList,
      (item: FileData) => item.fileName !== fileName,
    );
    setFileDataList?.(newFileList);
  };

  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-collapse`]}>
      <Collapse
        defaultActiveKey={openKey}
        onChange={keys => {
          setOpenKey([...keys]);
        }}
        expandIcon={({ isActive }) => (
          <CaretDownOutlined rotate={isActive ? 0 : -90} />
        )}
      >
        {fileListDataMap({
          fileDataList,
          isFullView,
          handleDelete,
          setFileDataList,
          graphData,
        })}
        {/* 远古版本预留，有bug，代码冗余 */}
        {/* {map(fileDataList, (fileData, index) => {
          return (
            <Panel
              forceRender
              key={index}
              header={
                <Space>
                  {isFullView ? (
                    <>
                      <div>文件名：{fileData?.fileName}</div>
                      <div>文件大小：{fileData?.formateSize}</div>
                      <div
                        className={
                          styles[`${PUBLIC_PERFIX_CLASS}-collapse-status`]
                        }
                      >
                        读取结果：
                        <Badge
                          status={fileData?.status}
                          text={fileData?.status}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className={
                          styles[`${PUBLIC_PERFIX_CLASS}-collapse-name`]
                        }
                      >
                        文件名：
                        <Tooltip title={fileData?.fileName}>
                          {fileData?.fileName}
                        </Tooltip>
                      </div>
                      <div
                        className={
                          styles[`${PUBLIC_PERFIX_CLASS}-collapse-size`]
                        }
                      >
                        文件大小：
                        <Tooltip title={fileData?.formateSize}>
                          {fileData?.formateSize}
                        </Tooltip>
                      </div>
                      <div
                        className={
                          styles[`${PUBLIC_PERFIX_CLASS}-collapse-status`]
                        }
                      >
                        读取结果：
                        <Badge
                          status={fileData?.status}
                          text={fileData?.status}
                        />
                      </div>
                    </>
                  )}
                </Space>
              }
              extra={
                <>
                  <Popconfirm
                    overlayClassName={styles.popConfirmBox}
                    title="确认要删除吗"
                    onConfirm={() => handleDelete(fileData.fileName)}
                  >
                    <Button type="link" onClick={e => e.stopPropagation()}>
                      删除
                    </Button>
                  </Popconfirm>
                </>
              }
            >
              <DataMapping
                currentFileData={{ ...fileData }}
                fileDataList={fileDataList}
                setFileDataList={setFileDataList}
                graphData={graphData}
              />
            </Panel>
          );
        })} */}
      </Collapse>
    </div>
  );
};
