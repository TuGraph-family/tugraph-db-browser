import React from 'react';
import { StepUIProps } from './types';
import { Assets } from './assets';
// @ts-ignore
import styles from './index.module.less';

/**
 * 新手引导 - 样式按钮
 * @returns 
 */
export const StyleBtn: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0, canvasX = 0, canvasY = 0 }) => {
  return (
    <div className={styles.styleBtn} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 365, top: 0, left: 0 }} src={Assets.styleBtn} />
        <img className={styles.background} style={{ width: 365, top: canvasY - y, left: canvasX - x }} src={Assets.afterSpread} />
        <div className={styles.btnContainer} style={{ top: 105, left: 248 }} >
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={Assets.btnNext} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} onClick={end} style={{ top: 24, left: 358 }}>
          <img src={Assets.close} />
        </div>
      </div>
    </div>
  );
};


/**
 * 新手引导 - 样式面板
 * @returns 
 */
export const StylePanel: React.FC<StepUIProps> = ({ prev, next, end, x = 0, y = 0, canvasX, canvasY }) => {
  return (
    <div className={styles.stylePanel} style={{ top: y, left: x }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 384 }} src={Assets.stylePanel} />
        <img className={styles.background} style={{ top: canvasY - y, left: canvasX - x }} src={Assets.afterStyle} />
        <img className={styles.gif} src={Assets.styleGif} style={{ top: 49, left: 43, maxWidth: 288 }} />
        <div className={styles.btnContainer} style={{ top: 362, left: 248 }}>
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
