import type { HTMLAttributes, ReactNode } from '@alipay/bigfish/react';
import React from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../constant';
import IconFont from '../icon-font';

import styles from './index.module.less';

interface IconItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  name?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  iconProps?: {
    style?: React.CSSProperties;
  };
  direction?: 'horizontal';
}

const IconItem: React.FC<IconItemProps> = ({
  icon,
  name,
  onClick,
  disabled,
  iconProps,
  direction,
  ...others
}) => {
  return (
    <div
      {...others}
      className={[
        disabled
          ? styles[`${PUBLIC_PERFIX_CLASS}-icon-item-disabled`]
          : styles[`${PUBLIC_PERFIX_CLASS}-icon-item`],
        styles[`${PUBLIC_PERFIX_CLASS}-icon-item__${direction || 'vertical'}`],
        'icon-item',
      ].join(' ')}
      onClick={disabled ? undefined : onClick}
    >
      {typeof icon === 'string' ? (
        <IconFont {...iconProps} type={icon} />
      ) : (
        icon
      )}
      {name && (
        <div
          className={[
            styles[`${PUBLIC_PERFIX_CLASS}-icon-item-name`],
            'icon-item-name',
          ].join(' ')}
        >
          {name}
        </div>
      )}
    </div>
  );
};

export default IconItem;
