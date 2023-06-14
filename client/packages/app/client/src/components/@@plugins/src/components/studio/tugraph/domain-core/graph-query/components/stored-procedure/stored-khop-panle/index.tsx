import { Input } from 'antd';
import React from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../../../../constant';

import styles from './index.module.less';

type Prop = {};
export const StoredKhopPanle: React.FC<Prop> = () => {
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-container`]}>
      <div
        className={styles[`${PUBLIC_PERFIX_CLASS}-container-box`]}
        style={{ width: '75%' }}
      >
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]}>
          参数输入
        </div>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-content`]}>
          <Input.TextArea style={{ resize: 'none' }} />
        </div>
      </div>
      <div
        className={styles[`${PUBLIC_PERFIX_CLASS}-container-box`]}
        style={{ width: '25%' }}
      >
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]}>
          KHOP
        </div>
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-content`]}>
          <div
            className={
              styles[`${PUBLIC_PERFIX_CLASS}-container-box-content-text`]
            }
          >
            <div
              className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]}
            >
              存储过程类型：CPP
            </div>
            <div
              className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]}
            >
              是否只读：只读
            </div>
            <div
              className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]}
            >
              存储过程描述：
            </div>
          </div>
        </div>
      </div>
      {/* <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> */}
    </div>
  );
};
