import React from 'react';
import { StepUIProps } from './types';
import QueryImage from './assets/query.png';
import NextBtnImage from './assets/btn-next.png';
import CloseImage from './assets/close.svg';
import styles from './index.module.less';

/**
 * 新手引导 - 数据查询
 * @returns 
 */
export const Query: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0 }) => {
  return (
    <div className={styles.query} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} src={QueryImage} />
        <div className={styles.btnContainer}>
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={NextBtnImage} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} onClick={end}>
          <img src={CloseImage} />
        </div>
      </div>
    </div>
  );
};

