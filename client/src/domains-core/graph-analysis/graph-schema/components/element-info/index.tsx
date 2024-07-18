import React, { useMemo } from 'react';
import styles from './index.less';

interface ElementInfoProps {
  value: any;
}

const ElementInfo: React.FC<ElementInfoProps> = ({ value }) => {
  if (!value) {
    return null;
  }
  const { label, properties } = value;
  const propertyKeys = useMemo(() => Object.keys(properties), [properties]);
  return (
    <div className={styles['element-info']}>
      <div className={styles['element-info-title']}>类型：{label}</div>
      {propertyKeys.length ? (
        <div className={styles['element-info-content']}>
          {Object.keys(properties).map((item) => {
            return (
              <div className={styles['element-info-content-item']} key={item}>
                <div className={styles['item-label']}>{item}：</div>
                <div className={styles['item-value']}>{properties[item]}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ElementInfo;
