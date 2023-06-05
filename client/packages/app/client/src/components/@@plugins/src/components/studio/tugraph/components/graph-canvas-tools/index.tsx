import React from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../constant';
import AutoZoom from './components/auto-zoom';
import RealZoom from './components/real-zoom';
import ZoomIn from './components/zoom-in';
import ZoomOut from './components/zoom-out';

import { Tooltip } from 'antd';
import styles from './index.module.less';

export const GraphCanvasTools: React.FC = () => {
  return (
    <div
      className={[
        styles[`${PUBLIC_PERFIX_CLASS}-graph-canvas-tools`],
        `${PUBLIC_PERFIX_CLASS}-graph-canvas-tools`,
      ].join(' ')}
    >
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-graph-canvas-tools-item`]}>
        <Tooltip title="缩小">
          <ZoomIn />
        </Tooltip>
      </div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-graph-canvas-tools-item`]}>
        <Tooltip title="放大">
          <ZoomOut />
        </Tooltip>
      </div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-divider`]} />
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-graph-canvas-tools-item`]}>
        <Tooltip title="画布1:1">
          <RealZoom />
        </Tooltip>
      </div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-graph-canvas-tools-item`]}>
        <Tooltip title="全屏">
          <AutoZoom />
        </Tooltip>
      </div>
    </div>
  );
};
