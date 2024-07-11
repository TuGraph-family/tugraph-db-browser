import { ClockCircleFilled } from '@ant-design/icons';
import { Button, Descriptions, Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import React, { Dispatch, SetStateAction } from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../../constant';

import styles from './index.module.less';
import { FileData } from '@/components/studio/interface/import';

type Prop = {
  status: string;
  graphName: string;
  setShowResult: Dispatch<SetStateAction<boolean>>;
  data: any;
  setFileDataList?: (files: FileData[]) => void;
};

export const ImportDataResult: React.FC<Prop> = ({
  graphName,
  status,
  setShowResult,
  data,
  setFileDataList,
}) => {
  const titleMap = {
    success: '数据导入成功',
    error: '数据导入失败',
    loading: '数据导入中',
  };

  const handleClick = () => {
    setFileDataList?.([]);
    setShowResult(false);
  };

  const extraButtonMap = {
    success: [
      <Button
        key="0"
        onClick={() => {
          window.location.hash = `/query?graphName=${graphName}`;
        }}
      >
        前往图查询
      </Button>,
      <Button type="primary" key="1" onClick={handleClick}>
        继续导入
      </Button>,
    ],
    error: [
      <Button onClick={handleClick} type="primary" key="1">
        重新导入
      </Button>,
    ],
    loading: [
      <Button onClick={handleClick} type="primary" key="1">
        继续导入
      </Button>,
    ],
  };

  if (status === 'loading') {
    return (
      <Result
        className={styles[`${PUBLIC_PERFIX_CLASS}-result`]}
        icon={<ClockCircleFilled />}
        title={titleMap[status]}
        subTitle={errorMessage}
        extra={extraButtonMap[status]}
      />
    );
  }

  // 上传结果
  const renderDes = () => {
    const {
      total = 0,
      data_error = 0,
      insert = 0,
      update = 0,
      index_conflict = 0,
    } = data?.[0] || {};
    return (
      <Descriptions column={1}>
        <Descriptions.Item label="总共条数">{total}条</Descriptions.Item>
        <Descriptions.Item label="数据插入">{insert}条</Descriptions.Item>
        <Descriptions.Item label="数据更新">{update}条</Descriptions.Item>
        <Descriptions.Item label="数据错误">{data_error}条</Descriptions.Item>
        <Descriptions.Item label="索引冲突">
          {index_conflict}条
        </Descriptions.Item>
      </Descriptions>
    );
  };
  return (
    <Result
      className={styles[`${PUBLIC_PERFIX_CLASS}-result`]}
      status={status as ResultStatusType}
      title={titleMap[status]}
      extra={extraButtonMap[status]}
    >
      {status === 'success' ? renderDes() : null}
    </Result>
  );
};
