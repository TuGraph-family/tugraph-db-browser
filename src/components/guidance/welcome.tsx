import React from 'react';
import { StepUIProps } from './types';
import { Assets } from './assets';
// @ts-ignore
import styles from './index.module.less';

/**
 * 新手引导 - 欢迎页
 * @returns
 */
export const Welcome: React.FC<StepUIProps> = ({ prev, next, end }) => {
  return (
    <div className={styles.welcome}>
      <div className={styles.container}>
        <img className={styles.background} src={Assets.welcome} />
        <div className={styles.startBtnStart}>
          <img className={styles.btnBackground} src={Assets.btnWelcome} />
          <div className={styles.startText} onClick={next}>
            开启破案之旅
          </div>
        </div>

        <div className={styles.close} onClick={end}>
          <img src={Assets.close} />
        </div>
      </div>
    </div>
  );
};
