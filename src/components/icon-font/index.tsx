// https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.20&manage_type=myprojects&projectId=3146710&keyword=&project_type=&page=
import '@/assets/icons/iconfont';
import '@/assets/node-icons/iconfont';
import React from 'react';
import styles from './index.less';

interface IconFontProps extends React.HTMLProps<HTMLSpanElement> {
  rotate?: number;
  type: string;
}

const IconFont: React.FC<IconFontProps> = (props) => {
  const { type, rotate, style, className, ...others } = props;
  return (
    <span
      role="img"
      {...others}
      style={{
        ...style,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
      }}
      className={['anticon', className, styles['anticon']].join(' ')}
    >
      <svg className={[styles['icon']].join(' ')} aria-hidden="true">
        <use xlinkHref={`#${type}`}></use>
      </svg>
    </span>
  );
};

export default IconFont;
