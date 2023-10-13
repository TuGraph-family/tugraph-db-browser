import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, Row, Col, Skeleton, message } from 'antd';
import { Driver, Step } from '../driver';

import { Welcome } from './welcome';
import { Query } from './query';
import { Spread } from './spread';
import { StyleBtn, StylePanel } from './style';
import { FilterBtn, FilterPanel } from './filter';
import { Download } from './download';
import { End } from './end';

import styles from './index.module.less';

const Steps = [
  { element: '.page-header', popover: { title: 'Title', description: 'Description' } },
  { element: '.top-nav', popover: { title: 'Title', description: 'Description' } },
  { element: '.sidebar', popover: { title: 'Title', description: 'Description' } },
  { element: '.footer', popover: { title: 'Title', description: 'Description' } },
];

/**
 * 新手引导组件
 * @returns 
 */
export const Guidance: React.FC = () => {
  const driver = useRef(null);
  const [step, setStep] = useState<number>(0);

  const onStepChange = useMemo(() => {
    return (step: Step, idx: number, steps: Step[]) => {
      setStep(idx);
    };
  }, []);

  // 初始化新手引导的 driver
  useEffect(() => {
    driver.current = new Driver(Steps, onStepChange);
    // 如果没有阅读过新手引导（localStorage），启动新手引导
    setStep(0);
    setInterval(() => {
      setStep(step + 1);
    }, 2000)
  }, []);

  return (
    <div className={styles.guidance}>
      <div>guidance</div>
      { step === 0 && <Welcome /> }
      { step === 1 && <Query /> }
      { step === 2 && <Spread /> }
      { step === 3 && <StyleBtn /> }
      { step === 4 && <StylePanel /> }
      { step === 5 && <FilterBtn /> }
      { step === 6 && <FilterPanel /> }
      { step === 7 && <Download /> }
      { step === 8 && <End /> }
    </div>
  );
};
