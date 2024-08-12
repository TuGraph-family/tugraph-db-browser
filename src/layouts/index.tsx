/**
 * file: container 相关tsx定义
 * author: Allen
 */
import { Col, Row } from 'antd';
import React from 'react';
import { Outlet } from 'umi';

// style
import styles from './index.less';

interface IContainerProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

interface IConsoleContainerProps {
  sidebar: React.ReactNode;
  content: React.ReactNode;
}

export const Container: React.FC<IContainerProps> = props => {
  return (
    <div
      className={styles?.umiContainer}
      style={props?.style}
      id="TUGRAPH_DB_BROWSER"
    >
      {props?.children}
    </div>
  );
};

export const ConsoleContainer: React.FC<IConsoleContainerProps> = props => {
  const { sidebar, content } = props;

  return (
    <Row className={styles?.consoleContainer}>
      <Col span={3}>{sidebar}</Col>
      <Col span={21}>{content}</Col>
    </Row>
  );
};

export const ConsoleContentContainer: React.FC<IContainerProps> = props => {
  return (
    <div className={styles?.consoleContentContainer}>
      {props?.children || null}
    </div>
  );
};

export default function Layout() {
  return (
    <div className={styles.appLayout}>
      <Outlet />
    </div>
  );
}
