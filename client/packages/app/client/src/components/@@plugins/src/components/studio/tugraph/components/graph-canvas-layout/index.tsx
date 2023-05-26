import React from 'react';
import type { Layout } from '@antv/graphin';
import { Popover } from 'antd';
import IconFont from '../icon-font';
import { CANVAS_LAYOUT } from './constant';

import styles from './index.module.less';
import { PUBLIC_PERFIX_CLASS } from '../../constant';

interface GraphCanvasLayoutProps {
  onLayoutChange: (layout: Layout) => void;
  currentLayout: Layout;
}

export const GraphCanvasLayout: React.FC<GraphCanvasLayoutProps> = ({ onLayoutChange, currentLayout }) => {
  return (
    <div className={[styles[`${PUBLIC_PERFIX_CLASS}-graph-canvas-layout`], 'graph-canvas-layout'].join(' ')}>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-types`]}>
        {CANVAS_LAYOUT.map((item) => {
          const { icon, title, layout } = item;
          return (
            <Popover content={title} placement="top" key={title}>
              <div
                className={
                  currentLayout.type === layout.type
                    ? [
                        styles[`${PUBLIC_PERFIX_CLASS}-types-item`],
                        styles[`${PUBLIC_PERFIX_CLASS}-types-item-active`],
                      ].join(' ')
                    : styles[`${PUBLIC_PERFIX_CLASS}-types-item`]
                }
              >
                <IconFont type={icon} onClick={() => onLayoutChange(layout)} />
              </div>
            </Popover>
          );
        })}
      </div>
    </div>
  );
};
