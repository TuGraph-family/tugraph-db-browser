import { UserCenter } from '@/components/studio';
import { APP_LINKS } from '@/constants';
// @ts-nocheck
import { Col, Row } from 'antd';
import { useState } from 'react';
import { useLocation } from 'umi';
import styles from './index.less';
const Nav = ({ linkView = true }) => {
  const location = useLocation();
  const [curPath, setPath] = useState<any>(
    location?.pathname === '/' ? '/home' : location?.pathname,
  );

  return (
    <Row className={styles?.nav}>
      <Col span={3}>
        <img
          className={styles?.logo}
          src="https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*AbamQ5lxv0IAAAAAAAAAAAAADgOBAQ/original"
        ></img>
      </Col>
      <Col span={18}>
        {linkView && (
          <div className={styles.links}>
            {APP_LINKS.map(({ title, key, path }) => {
              return (
                <div
                  className={path === curPath ? styles?.linked : styles?.link}
                  key={key}
                  onClick={() => {
                    window.location.hash = path;
                  }}
                >
                  {title}
                </div>
              );
            })}
          </div>
        )}
      </Col>
      <Col span={3}>
        <div className={styles?.userInfo}>
          <UserCenter />
        </div>
      </Col>
    </Row>
  );
};

export default Nav;
