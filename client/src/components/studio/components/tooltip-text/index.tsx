import { message, Tooltip, TooltipProps } from 'antd';
import copy from 'copy-to-clipboard';
import { join } from 'lodash';
import type { FC, ReactNode } from 'react';
import React from 'react';

import styles from './index.module.less';

interface TooltipTextProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  maxWidth: number;
  text: ReactNode;
  tooltipProps?: TooltipProps;
}

export const TooltipText: FC<TooltipTextProps> = ({
  maxWidth,
  text,
  style,
  tooltipProps,
  ...others
}) => {
  return (
    <div
      onClick={() => {
        if (typeof text === 'string') {
          copy(text);
          message.success('复制成功');
        }
      }}
      {...others}
    >
      <Tooltip
        title={text}
        overlayInnerStyle={{
          maxHeight: '300px',
          overflowY: 'auto',
          color: 'black',
        }}
        color="white"
        {...tooltipProps}
      >
        <span
          className={join(['tooltip-text', styles['tooltip-text']], ' ')}
          style={{
            maxWidth,
            color: 'rgba(22,119,255,1)',
            ...style,
          }}
        >
          {text}
        </span>
      </Tooltip>
    </div>
  );
};
