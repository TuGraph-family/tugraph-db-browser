import { CaretDownOutlined } from '@ant-design/icons';
import { Badge, Button, Collapse, Popconfirm, Space, Tooltip } from 'antd';
import { filter, map } from 'lodash';
import { PUBLIC_PERFIX_CLASS } from '../../../constant';
import { FileData } from '../../../interface/import';
import { GraphData } from '../../../interface/schema';
import { DataMapping } from './data-mapping';

import styles from './index.module.less';

const { Panel } = Collapse;

export interface ImportDataConfigProps {
  fileDataList: FileData[];
  graphData: GraphData;
  setFileDataList?: (files: FileData[]) => void;
  isFullView?: boolean;
}

export const ImportDataConfig = (prop: ImportDataConfigProps) => {
  const { fileDataList = [], setFileDataList, graphData, isFullView } = prop;

  const handleDelete = (fileName: string) => {
    const newFileList = filter(
      fileDataList,
      (item: FileData) => item.fileName !== fileName
    );
    setFileDataList?.(newFileList);
  };

  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-collapse`]}>
      <Collapse
        defaultActiveKey={['1']}
        expandIcon={({ isActive }) => (
          <CaretDownOutlined rotate={isActive ? 0 : -90} />
        )}
      >
        {map(fileDataList, (fileData, index) => {
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
                        读取结果：{' '}
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
                        文件名：{' '}
                        <Tooltip title={fileData?.fileName}>
                          {fileData?.fileName}
                        </Tooltip>
                      </div>
                      <div
                        className={
                          styles[`${PUBLIC_PERFIX_CLASS}-collapse-size`]
                        }
                      >
                        文件大小：{' '}
                        <Tooltip title={fileData?.formateSize}>
                          {fileData?.formateSize}
                        </Tooltip>
                      </div>
                      <div
                        className={
                          styles[`${PUBLIC_PERFIX_CLASS}-collapse-status`]
                        }
                      >
                        读取结果：{' '}
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
                    <Button type="link" onClick={(e) => e.stopPropagation()}>
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
        })}
      </Collapse>
    </div>
  );
};
