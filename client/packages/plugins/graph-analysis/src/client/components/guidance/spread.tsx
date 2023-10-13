import React from 'react';
import { StepUIProps } from './types';
import SpreadImage from './assets/spread.png';
import NextBtnImage from './assets/next-btn.png';
import CloseImage from './assets/close.svg';
import styles from './index.module.less';

/**
 * 新手引导 - 扩散
 * @returns 
 */
export const Spread: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0 }) => {
  return (
    <div className={styles.spread} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 430 }} src={SpreadImage} />
        <div className={styles.btnContainer}>
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={NextBtnImage} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} style={{ top: 0 }} onClick={end}>
          <img src={CloseImage} />
        </div>
      </div>
    </div>
  );
};

