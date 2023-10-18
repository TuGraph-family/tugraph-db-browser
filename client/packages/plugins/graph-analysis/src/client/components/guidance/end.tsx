import React from 'react';
import { StepUIProps } from './types';
import { Assets } from './assets';
import styles from './index.module.less';

/**
 * 新手引导 - 结束页
 * @returns 
 */
export const End: React.FC<StepUIProps> = ({ prev, next, end }) => {
  return (
    <div className={styles.end}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 854 }} src={Assets.end} />
        <div className={styles.startBtn}>
          <img className={styles.btnBackground} style={{ width: 210 }} src={Assets.btnEnd} />
          <div className={styles.startText} onClick={end}>进入图分析自由探索</div>
        </div>
      </div>
    </div>
  );
};
