import routes from '@/config/routes';
import { Col, Row } from 'antd';
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'umi';
import styles from './index.less';

export const Container = (props: React.ComponentProps<any>) => {
  return <div className={styles?.umiContainer}>{props?.children}</div>;
};

export const ConsoleContainer = (props: React.ComponentProps<any>) => {
  return (
    <Row className={styles?.consoleContainer}>
      <Col span={3}>{props?.children[0] || null}</Col>
      <Col span={21}>{props?.children[1] || null}</Col>
    </Row>
  );
};

export const ConsoleContentContainer = (props: React.ComponentProps<any>) => {
  return (
    <div className={styles?.consoleContentContainer}>
      {props?.children || null}
    </div>
  );
};

export default function Layout() {
  const location = useLocation();
  useEffect(() => {
    const current: any = routes.findLast(({ path }) =>
      `${location.pathname}`.includes(path)
    );
    document.title = current?.title + '- Openpiece';
  }, [location]);
  return (
    <div className={styles.appLayout}>
      <Outlet />
    </div>
  );
}
