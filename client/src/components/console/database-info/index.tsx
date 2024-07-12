import { motion } from "framer-motion";
import { Card, Col, message, Row, Skeleton } from 'antd';
import { forEach, map } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { PUBLIC_PERFIX_CLASS } from '../constant';
import { useDataInfo } from '../hooks/useDataInfo';
import { formatTime } from '../utils/timeFormatter';

import styles from './index.module.less';

export const DatabaseInfo: React.FC = () => {
  const {
    getDatabaseInfoLoading,
    onGetDatabaseInfo,
    getSystemInfoLoading,
    onGetSystemInfo,
  } = useDataInfo();
  const [state, updateState] = useImmer<{
    systemInfo: {
      lgraph_version?: string;
      up_time?: number;
      git_branch?: string;
      git_commit?: string;
      web_commit?: string;
      cpp_version?: string;
      python_version?: string;
      cpp_id?: string;
    };
    databaseInfo: Record<string, any>;
  }>({
    systemInfo: {},
    databaseInfo: [],
  });

  const { systemInfo, databaseInfo } = state;

  useEffect(() => {
    onGetSystemInfo().then((res) => {
      if (res.success) {
        let info = {};
        forEach(res.data, (item: { name: string; value: string }) => {
          info[item.name] = item.value;
        });
        updateState((draft) => {
          draft.systemInfo = info;
        });
      } else {
        message.error(res.errorMessage);
      }
    });

    onGetDatabaseInfo().then((res) => {
      if (res.success) {
        updateState((draft) => {
          draft.databaseInfo = res.data;
        });
      } else {
        message.error(res.errorMessage);
      }
    });
  }, []);

  return (
    <motion.div
      className={styles[`${PUBLIC_PERFIX_CLASS}-base-info`]}
      initial={{height: 0, opacity: 0}}
      animate={{height: '100%', opacity: 1}}
      transition={{duration: 0.5}}
    >
      <Card title="基础信息">
        <Skeleton loading={getSystemInfoLoading}>
          <Row style={{ width: '100%' }}>
            <Col
              key="lgraph_version"
              className={styles[`${PUBLIC_PERFIX_CLASS}-card-item`]}
            >
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-label`]}>
                服务器版本号
              </div>
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-val`]}>
                {systemInfo.lgraph_version || '-'}
              </div>
            </Col>
            <Col
              key="up_time"
              className={styles[`${PUBLIC_PERFIX_CLASS}-card-item`]}
            >
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-label`]}>
                运行时间
              </div>
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-val`]}>
                {formatTime(systemInfo.up_time) || '-'}
              </div>
            </Col>
            <Col
              key="git_branch"
              className={styles[`${PUBLIC_PERFIX_CLASS}-card-item`]}
            >
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-label`]}>
                服务器代码版本
              </div>
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-val`]}>
                {systemInfo.git_branch || '-'}
              </div>
            </Col>
            <Col
              key="web_commit"
              className={styles[`${PUBLIC_PERFIX_CLASS}-card-item`]}
            >
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-label`]}>
                前端代码版本号
              </div>
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-val`]}>
                {systemInfo.web_commit || '-'}
              </div>
            </Col>
            <Col
              key="cpp_id"
              className={styles[`${PUBLIC_PERFIX_CLASS}-card-item`]}
            >
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-label`]}>
                CPP编译器版本号
              </div>
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-val`]}>
                {systemInfo.cpp_id || '-'}
              </div>
            </Col>
            <Col
              key="python_version"
              className={styles[`${PUBLIC_PERFIX_CLASS}-card-item`]}
            >
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-label`]}>
                Python版本号
              </div>
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-val`]}>
                {systemInfo.python_version || '-'}
              </div>
            </Col>
            <Col
              key="cpp_id"
              className={styles[`${PUBLIC_PERFIX_CLASS}-card-item`]}
            >
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-label`]}>
                CPP编辑器ID
              </div>
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-val`]}>
                {systemInfo.cpp_id || '-'}
              </div>
            </Col>
          </Row>
        </Skeleton>
      </Card>
      <Card title="数据库配置信息">
        <Skeleton loading={getDatabaseInfoLoading}>
          <Row style={{ width: '100%' }}>
            {map(databaseInfo, (item) => (
              <Col
                key={`col-${item.label}`}
                className={styles[`${PUBLIC_PERFIX_CLASS}-card-item`]}
              >
                <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-label`]}>
                  {item.name}
                </div>
                <div className={styles[`${PUBLIC_PERFIX_CLASS}-item-val`]}>
                  {`${item.value}` || '-'}
                </div>
              </Col>
            ))}
          </Row>
        </Skeleton>
      </Card>
    </motion.div>
  );
};

export default DatabaseInfo;
