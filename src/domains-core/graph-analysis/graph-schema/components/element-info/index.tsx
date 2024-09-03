import { Typography } from 'antd';
import React, { useMemo } from 'react';
import styles from './index.less';

const { Paragraph } = Typography;

interface ElementInfoProps {
  value: any;
}

const ElementInfo: React.FC<ElementInfoProps> = ({ value }) => {
  if (!value) {
    return null;
  }
  const { label, properties, itemType, id } = value;
  const isNode = itemType === 'NODE';

  const propertyKeys = useMemo(() => Object.keys(properties), [properties]);
  return (
    <div className={styles['element-info']}>
      <div className={styles['element-info-title']}>
        <Paragraph ellipsis={{ expandable: false, rows: 1, tooltip: id }}>
          {isNode ? '点' : '边'}ID：{id}
        </Paragraph>
      </div>
      <div className={styles['element-info-title']}>
        {isNode ? '点' : '边'}类型：{label}
      </div>
      {
        !isNode &&
          <>
            <div className={styles['element-info-title']}>
              起点ID：{value?.source}
            </div>
            <div className={styles['element-info-title']}>
              终点ID：{value?.target}
            </div>
          </>
      }
      {propertyKeys.length ? (
        <div className={styles['element-info-content']}>
          {Object.keys(properties).map((item) => {
            return (
              <div className={styles['element-info-content-item']} key={item}>
                <div className={styles['item-label']}>{item}：</div>
                <div className={styles['item-value']}>{`${properties[item]}`}</div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default ElementInfo;
