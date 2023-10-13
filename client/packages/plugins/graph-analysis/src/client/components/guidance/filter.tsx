import React from 'react';
import { StepUIProps } from './types';
import FilterBtnImage from './assets/filter-btn.png';
import FilterPanelImage from './assets/filter-panel.png';
import NextBtnImage from './assets/next-btn.png';
import CloseImage from './assets/close.svg';
import styles from './index.module.less';

/**
 * 新手引导 - 筛选按钮
 * @returns 
 */
export const FilterBtn: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0 }) => {
  return (
    <div className={styles.filterBtn} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 365 }} src={FilterBtnImage} />
        <div className={styles.btnContainer}>
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={NextBtnImage} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} style={{ top: 24 }} onClick={end}>
          <img src={CloseImage} />
        </div>
      </div>
    </div>
  );
};


/**
 * 新手引导 - 筛选面板
 * @returns 
 */
export const FilterPanel: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0 }) => {
  return (
    <div className={styles.filterPanel} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 384 }} src={FilterPanelImage} />
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
