/**
 * author: Allen
 * file: graph analyze title
*/

import React from 'react';
import styles from './index.less';
import { parseHashRouterParams } from '@/utils/parseHash';

interface PageTitleProps {
  value: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ value }) => {
  const { graphName } = parseHashRouterParams(location.hash);
  
  return <div className={styles['page-title']}>{graphName || value}</div>;
};

export default PageTitle;
