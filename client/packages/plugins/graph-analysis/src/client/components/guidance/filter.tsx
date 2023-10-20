import React from 'react';
import { StepUIProps } from './types';
import { Assets } from './assets';
import styles from './index.module.less';

/**
 * 新手引导 - 筛选按钮
 * @returns 
 */
export const FilterBtn: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0, canvasX, canvasY }) => {
  return (
    <div className={styles.filterBtn} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 365 }} src={Assets.filterBtn} />
        <img className={styles.background} style={{ top: canvasY - y, left: canvasX - x }} src={Assets.afterStyle} />
        <div className={styles.btnContainer} style={{ top: 96, left: 248 }} >
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={Assets.btnNext} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} onClick={end} style={{ top: 24, left: 356 }}>
          <img src={Assets.close} />
        </div>
      </div>
    </div>
  );
};


/**
 * 新手引导 - 筛选面板
 * @returns 
 */
export const FilterPanel: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0, canvasX, canvasY }) => {
  return (
    <div className={styles.filterPanel} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 384 }} src={Assets.filterPanel} />
        <img className={styles.background} style={{ top: canvasY - y, left: canvasX - x }} src={Assets.afterFilter} />
        <img className={styles.gif} src={Assets.filterGif} style={{ top: 99, left: 52, maxWidth: 272 }} />
        <div className={styles.btnContainer} style={{ top: 405, left: 243 }} >
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={Assets.btnNext} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} style={{ top: 0, left: 355 }} onClick={end}>
          <img src={Assets.close} />
        </div>
      </div>
    </div>
  );
};
