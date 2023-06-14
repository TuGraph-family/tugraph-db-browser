import React from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../../../../constant';

import styles from './index.module.less';

type Prop = {};
export const StoredResult: React.FC<Prop> = () => {
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-container`]}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-header`]}>
        执行结果
      </div>
      <div></div>
    </div>
  );
};
