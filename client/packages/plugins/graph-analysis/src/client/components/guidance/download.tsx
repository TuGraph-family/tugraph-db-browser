import React from 'react';
import { StepUIProps } from './types';
import { Assets } from './assets';
import styles from './index.module.less';

/**
 * 新手引导 - 下载
 * @returns 
 */
export const Download: React.FC<StepUIProps> = ({ prev, next, end, x, y, canvasX, canvasY }) => {
  return (
    <div className={styles.download} style={{ top: y, left: x - 300 }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 360 }} src={Assets.download} />
        <img className={styles.background} style={{ top: canvasY - y, left: canvasX - x + 300 }} src={Assets.afterFilter} />
        <div className={styles.btnContainer} style={{ top: 105, left: 248 }} >
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={Assets.btnNext} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} style={{ top: 28, right: 'unset', left: -32 }} onClick={end}>
          <img src={Assets.close} />
        </div>
      </div>
    </div>
  );
};
