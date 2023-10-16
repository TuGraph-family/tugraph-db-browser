import React, { useState, useEffect } from 'react';
import { useLocalStorageState } from 'ahooks';
import { Welcome } from './welcome';
import { Query } from './query';
import { Spread } from './spread';
import { StyleBtn, StylePanel } from './style';
import { FilterBtn, FilterPanel } from './filter';
import { Download } from './download';
import { End } from './end';

import styles from './index.module.less';

const LocalStorageKey = '__guidance_key__';
/**
  一些组件的 class selector。
  查询：gi-richcontainer-query-button
  筛选：gi-richcontainer-filter-button
  样式：gi-richcontainer-stylesetting-button
  下载按钮：tugraph-download-container
  左侧面板：gi-richcontainer-side
  GI 画布：gi-rich-container-canvas
  */
const SelectorQuery = '.gi-richcontainer-query-button';
const SelectorFilter = '.gi-richcontainer-filter-button';
const SelectorStyle = '.gi-richcontainer-stylesetting-button';
const SelectorDownload = '.tugraph-download-container';
const SelectorSidebar = '.gi-richcontainer-side';
const SelectorCanvas = '.gi-rich-container-canvas';

function getElement(selector: string): HTMLElement {
  return document.querySelector(selector);
}

function getBoundings(selector: string): DOMRect {
  return getElement(selector).getBoundingClientRect();
}

/**
 * 新手引导组件
 * @returns 
 */
export const Guidance: React.FC = () => {
  // localStorage 存储
  const [isGuidanceFinished, setGuidanceFinished] = useLocalStorageState<string>(LocalStorageKey);

  const [step, setStep] = useState<number>(0);

  // step 变化的时候，需要根据 step 自动打开对应的 dom 节点。
  useEffect(() => {
    if (step === 1) {
      // 查询
      getElement(SelectorQuery).click();
    } else if (step === 3) {
      // 样式
      getElement(SelectorStyle).click();
    } else if (step === 5) {
      // 筛选
      getElement(SelectorFilter).click();
    }
  }, [step]);

  const props = {
    prev: () => setStep(step - 1),
    next: () => setStep(step + 1),
    end: () => {
      setStep(-1);
      // todo 便于本地开发测试
      // setGuidanceFinished('1');
    },
  }

  function getGuidanceUI() {
    if (step === 0) return (<Welcome {...props} />);
    if (step === 1) {
      const rect = getBoundings(SelectorSidebar);
      return (<Query {...props } x={rect.right - 16} y={rect.top + 100} />);
    }
    if (step === 2) {
      const rect = getBoundings(SelectorCanvas);
      return (<Spread {...props } x={rect.x + rect.width * 0.382} y={300} />);
    }
    if (step === 3) {
      const rect = getBoundings(SelectorStyle);
      // 32px 是箭头的偏移
      return (<StyleBtn {...props } x={rect.x + rect.width / 2 - 32} y={rect.bottom} />);
    }
    if (step === 4) {
      const rect = getBoundings(SelectorSidebar);
      return (<StylePanel {...props } x={rect.right - 16} y={rect.top + 200} />);
    }
    if (step === 5) {
      const rect = getBoundings(SelectorFilter);
      // 32px 是箭头的偏移
      return (<FilterBtn {...props } x={rect.x + rect.width / 2 - 32} y={rect.bottom} />);
    }
    if (step === 6) {
      const rect = getBoundings(SelectorSidebar);
      return (<FilterPanel {...props }  x={rect.right - 16} y={rect.top + 100} />);
    }
    if (step === 7) {
      const rect = getBoundings(SelectorDownload);
      return (<Download {...props } x={rect.x + rect.width / 2} y={rect.bottom} />);
    }
    if (step === 8) {
      return (<End {...props } />);
    }
    return null;
  }

  return !isGuidanceFinished && 
    <div className={styles.guidance} style={{ display: step >= 0 && step <= 8 ? 'unset' : 'none' }}>
      { getGuidanceUI() }
    </div>;
};
