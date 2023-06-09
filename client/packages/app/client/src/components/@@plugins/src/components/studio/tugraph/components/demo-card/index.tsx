import React from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../constant';

import styles from './index.module.less';

type Prop = {
  isActive: boolean;
  onClick?: () => void;
  detail: {
    graph_name: string;
    description: string;
    imgUrl?: string;
    graph_demo_name: string;
  };
};
const DemoCard: React.FC<Prop> = ({ isActive, onClick, detail }) => {
  return (
    <div
      className={`${styles[`${PUBLIC_PERFIX_CLASS}-card-container`]} ${
        isActive ? styles[`${PUBLIC_PERFIX_CLASS}-active-card`] : ''
      }`}
      onClick={onClick}
    >
      <div
        className={isActive ? styles[`${PUBLIC_PERFIX_CLASS}-card-horn`] : ''}
      ></div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-card-img`]}>
        <img src={detail.imgUrl} alt="" />
      </div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-card-title`]}>
        {detail.graph_demo_name || detail.graph_name}
      </div>
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-card-desc`]}>
        {detail.description}
      </div>
    </div>
  );
};
export default DemoCard;
