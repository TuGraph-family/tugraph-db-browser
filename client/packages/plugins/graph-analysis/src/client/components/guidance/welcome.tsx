import React from 'react';
import { StepUIProps } from './types';
import WelcomeImage from './assets/welcome.png';
import StartBtnImage from './assets/btn-welcome.png';
import CloseImage from './assets/close.svg';
import styles from './index.module.less';

/**
 * 新手引导 - 欢迎页
 * @returns 
 */
export const Welcome: React.FC<StepUIProps> = ({ prev, next, end }) => {
  return (
    <div className={styles.welcome}>
      <div className={styles.container}>
        <img className={styles.background} src={WelcomeImage} />
        <div className={styles.startBtn}>
          <img className={styles.btnBackground} src={StartBtnImage} />
          <div className={styles.startText} onClick={next}>开启破案之旅</div>
        </div>
      
        <div className={styles.close} onClick={end}>
          <img src={CloseImage} />
        </div>
      </div>
    </div>
  );
};
