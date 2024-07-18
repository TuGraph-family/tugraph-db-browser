/**
 * author: Allen
 * file: graph analyze title
*/

import React from 'react';
import styles from './index.less';

interface PageTitleProps {
  value: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ value }) => {
  return <div className={styles['page-title']}>{value}</div>;
};

export default PageTitle;
