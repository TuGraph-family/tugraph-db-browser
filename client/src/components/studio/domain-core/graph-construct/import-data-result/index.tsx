import { ClockCircleFilled } from '@ant-design/icons';
import { Button, Result } from 'antd';
import { ResultStatusType } from 'antd/lib/result';
import React, { Dispatch, SetStateAction } from 'react';
import { history } from 'umi';
import { PUBLIC_PERFIX_CLASS } from '../../../constant';

import styles from './index.module.less';

type Prop = {
  status: string;
  graphName: string;
  taskId?: string;
  setShowResult: Dispatch<SetStateAction<boolean>>;
  importProgressCancel: () => void;
  errorMessage?: string;
};

export const ImportDataResult: React.FC<Prop> = ({
  graphName,
  status,
  errorMessage,
  importProgressCancel,
  setShowResult,
}) => {
  const titleMap = {
    success: '数据导入成功',
    error: '数据导入失败',
    loading: '数据导入中',
  };

  const extraButtonMap = {
    success: [
      <Button
        key="0"
        onClick={() => {
          importProgressCancel();
          window.location.hash = `/query?graphName=${graphName}`
        }}
      >
        前往图查询
      </Button>,
      <Button
        type="primary"
        key="1"
        onClick={() => {
          importProgressCancel();
          setShowResult(false);
        }}
      >
        继续导入
      </Button>,
    ],
    error: [
      <Button
        onClick={() => {
          importProgressCancel();
          setShowResult(false);
        }}
        type="primary"
        key="1"
      >
        重新导入
      </Button>,
    ],
    loading: [
      <Button
        onClick={() => {
          importProgressCancel();
          setShowResult(false);
        }}
        type="primary"
        key="1"
      >
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
  return (
    <Result
      className={styles[`${PUBLIC_PERFIX_CLASS}-result`]}
      status={status as ResultStatusType}
      title={titleMap[status]}
      subTitle={errorMessage}
      extra={extraButtonMap[status]}
    />
  );
};
