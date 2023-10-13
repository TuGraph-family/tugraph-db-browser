import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useLocalStorageState } from 'ahooks';
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

const LocalStorageKey = '__guidance_key__'

/**
 * 新手引导组件
 * @returns 
 */
export const Guidance: React.FC = () => {
  // localStorage 存储
  const [isGuidanceFinished, setGuidanceFinished] = useLocalStorageState<string>(LocalStorageKey);

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
  }, []);

  // step 变化的时候，需要根据 step 自动打开对应的 dom 节点。
  useEffect(() => {
    /**
      查询：gi-richcontainer-query-button
      筛选：gi-richcontainer-filter-button
      样式：gi-richcontainer-stylesetting-button
      下载按钮：tugraph-download-container
      左侧面板：gi-richcontainer-side
     */
    if (step === 1) {
      // 查询
    } else if (step === 3) {
      // 样式
    } else if (step === 5) {
      // 筛选
    }
  }, [step]);

  const props = {
    prev: () => setStep(step - 1),
    next: () => setStep(step + 1),
    end: () => {
      setStep(-1);
      setGuidanceFinished('1');
    },
  }

  return !isGuidanceFinished && 
    <div className={styles.guidance} style={{ display: step >= 0 && step <= 8 ? 'unset' : 'none' }}>
      { step === 0 && <Welcome {...props} /> }
      { step === 1 && <Query {...props } x={300} y={100} /> }
      { step === 2 && <Spread {...props } x={800} y={200} /> }
      { step === 3 && <StyleBtn {...props } x={465} y={90} /> }
      { step === 4 && <StylePanel {...props } x={300} y={200} /> }
      { step === 5 && <FilterBtn {...props } x={300} y={90} /> }
      { step === 6 && <FilterPanel {...props } x={300} y={200} /> }
      { step === 7 && <Download {...props } /> }
      { step === 8 && <End {...props } /> }
    </div>;
};
