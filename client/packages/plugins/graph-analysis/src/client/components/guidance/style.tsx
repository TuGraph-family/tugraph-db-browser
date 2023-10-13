import React from 'react';
import { StepUIProps } from './types';
import StyleBtnImage from './assets/style-btn.png';
import StylePanelImage from './assets/style-panel.png';
import NextBtnImage from './assets/btn-next.png';
import CloseImage from './assets/close.svg';
import styles from './index.module.less';

/**
 * 新手引导 - 样式按钮
 * @returns 
 */
export const StyleBtn: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0 }) => {
  return (
    <div className={styles.styleBtn} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 365 }} src={StyleBtnImage} />
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
 * 新手引导 - 样式面板
 * @returns 
 */
export const StylePanel: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0 }) => {
  return (
    <div className={styles.stylePanel} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 384 }} src={StylePanelImage} />
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
