import React from 'react';
import { StepUIProps } from './types';
import { Assets } from './assets';
// @ts-ignore
import styles from './index.module.less';

/**
 * 新手引导 - 扩散
 * @returns 
 */
export const Spread: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0 }) => {
  return (
    <div className={styles.spread} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 430 }} src={Assets.spread} />
        <img className={styles.gif} src={Assets.spreadGif} style={{ top: 78, left: 76, maxWidth: 256 }} />
        <div className={styles.btnContainer} style={{ top: 356, left: 245 }}>
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={Assets.btnNext} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} onClick={end} style={{ top: 0, left: 358 }}>
          <img src={Assets.close} />
        </div>
      </div>
    </div>
  );
};

