import React from 'react';
import { StepUIProps } from './types';
import DownloadImage from './assets/download.png';
import NextBtnImage from './assets/btn-next.png';
import CloseImage from './assets/close.svg';
import styles from './index.module.less';

/**
 * 新手引导 - 下载
 * @returns 
 */
export const Download: React.FC<StepUIProps> = ({ prev, next, end, x, y }) => {
  return (
    <div className={styles.download} style={{ right: 8, top: y }}>
      <div className={styles.container}>
        <img className={styles.background} style={{ width: 360 }} src={DownloadImage} />
        <div className={styles.btnContainer}>
          <div className={styles.nextBtn}>
            <img className={styles.btnBackground} src={NextBtnImage} />
            <div className={styles.nextText} onClick={next}>下一步</div>
          </div>
        </div>
        <div className={styles.close} style={{ top: 24, right: 'unset', left: -32 }} onClick={end}>
          <img src={CloseImage} />
        </div>
      </div>
    </div>
  );
};
