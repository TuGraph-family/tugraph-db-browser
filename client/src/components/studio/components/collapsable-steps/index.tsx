import { Tooltip } from 'antd';
import { map } from 'lodash';
import React from 'react';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';
import IconFont from '../icon-font';

import styles from './index.module.less';

export interface CollasibleStep {
  title: string;
  description: string;
  iconType: string;
  tooltipText?: string;
}

export interface CollasibleStepsProps {
  stepList: CollasibleStep[];
  totalStep?: number;
  collapsed?: boolean;
}

const CollasibleSteps: React.FC<CollasibleStepsProps> = ({
  stepList,
  totalStep = 2,
  collapsed,
}) => {
  return (
    <div
      className={styles[`${PUBLIC_PERFIX_CLASS}-collasible-steps`]}
      style={{
        height: !collapsed ? 90 : 0,
        marginTop: !collapsed ? 16 : 0,
        width: !collapsed ? '100%' : 0,
      }}
    >
      {map(stepList, ({ title, description, iconType, tooltipText }, index) => {
        return (
          <div
            className={styles[`${PUBLIC_PERFIX_CLASS}-step`]}
            key={title}
            style={{ width: '33.3%' }}
          >
            <div className={styles[`${PUBLIC_PERFIX_CLASS}-step-content`]}>
              <IconFont
                type={iconType}
                className={styles[`${PUBLIC_PERFIX_CLASS}-icon-text-title`]}
              />
              <div>
                <Tooltip title={tooltipText}>
                  <div className={styles[`${PUBLIC_PERFIX_CLASS}-title`]}>
                    {title}
                  </div>
                </Tooltip>
                <div className={styles[`${PUBLIC_PERFIX_CLASS}-desc`]}>
                  {description}
                </div>
              </div>
            </div>
            {index < totalStep && (
              <div className={styles[`${PUBLIC_PERFIX_CLASS}-step-arrow`]}>
                <IconFont
                  type="icon-arrow-right"
                  className={styles[`${PUBLIC_PERFIX_CLASS}-icon-rightstep`]}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CollasibleSteps;
