import React from 'react';
import { StepUIProps } from './types';
import { Assets } from './assets';
// @ts-ignore
import styles from './index.module.less';

/**
 * 新手引导 - 数据查询
 * @returns 
 */
export const Query: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0 }) => {
  return (
    <div className={styles.query} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} src={Assets.query} />
        <img className={styles.gif} src={Assets.queryGif} style={{ top: 164, left: 62, maxWidth: 267 }} />
        <div className={styles.btnContainer} style={{ top: 465, left: 248 }}>
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={Assets.btnNext} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} onClick={end} style={{ top: 72, left: 358 }}>
          <img src={Assets.close} />
        </div>
      </div>
    </div>
  );
};

