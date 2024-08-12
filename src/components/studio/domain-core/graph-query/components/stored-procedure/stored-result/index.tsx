import { Empty } from 'antd';
import React from 'react';
import ReactJson from 'react-json-view';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';

import styles from './index.module.less';

type Prop = {
  result: any;
};
export const StoredResult: React.FC<Prop> = ({ result }) => {
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-container`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-header`]}>
        执行结果
      </div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-content`]}>
        {result ? (
          <ReactJson src={result} displayDataTypes={false} />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
};
