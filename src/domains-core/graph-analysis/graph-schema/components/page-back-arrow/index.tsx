/**
 * author: Allen
 * file: back arrow
*/
import React from 'react';
import { LeftOutlined } from '@ant-design/icons';
import styles from './index.less';

const PageBackArrow: React.FC = () => {

  /** hash不支持原生回退，后续支持localStorage来存放hash栈信息来实现 */
  const onBack = () => {
    location.hash = '/home'
  };

  return (
    <div onClick={onBack} className={styles['page-back-arrow']}>
      <LeftOutlined />
    </div>
  );
};

export default PageBackArrow;
