import { Empty, Input, InputNumber } from 'antd';
import { join } from 'lodash';
import React, { useEffect } from 'react';
import { PUBLIC_PERFIX_CLASS } from '../../../../../constant';
import { ProcedureItemParams } from '../../../../../interface/procedure';

import { useImmer } from 'use-immer';
import styles from './index.module.less';

type Prop = {
  detail: ProcedureItemParams & { type: string };
  selectItem?: string;
  getParamValue: (value: string) => void;
  getTimeout: (value: number) => void;
  value?: string;
};
const emptyPanle = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
export const StoredKhopPanle: React.FC<Prop> = ({
  detail,
  selectItem,
  getParamValue,
  getTimeout,
  value: selectValue,
}) => {
  const [state, updateState] = useImmer<{ value?: string }>({ value: '' });
  const { value } = state;
  useEffect(() => {
    updateState((draft) => {
      draft.value = selectValue;
    });
  }, [selectItem]);
  return (
    <div
      className={join(
        [
          styles[`${PUBLIC_PERFIX_CLASS}-container`],
          !selectItem ? styles[`${PUBLIC_PERFIX_CLASS}-container-empty`] : '',
        ],
        ' '
      )}
    >
      {!selectItem ? (
        emptyPanle
      ) : (
        <>
          <div
            className={styles[`${PUBLIC_PERFIX_CLASS}-container-box`]}
            style={{ width: '75%' }}
          >
            <div
              className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]}
            >
              <div>参数输入</div>
              <div
                className={
                  styles[`${PUBLIC_PERFIX_CLASS}-container-box-text-right`]
                }
              >
                超时时长（秒）：
                <InputNumber
                  min={0}
                  defaultValue={300}
                  onChange={(val) => {
                    getTimeout(val);
                  }}
                />
              </div>
            </div>
            <div
              className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-content`]}
            >
              <Input.TextArea
                style={{ resize: 'none' }}
                value={value}
                onChange={(e) => {
                  getParamValue(e.target.value);
                  updateState((draft) => {
                    draft.value = e.target.value;
                  });
                }}
              />
            </div>
          </div>
          <div
            className={styles[`${PUBLIC_PERFIX_CLASS}-container-box`]}
            style={{ width: '25%' }}
          >
            <div
              className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]}
            >
              KHOP
            </div>
            <div
              className={styles[`${PUBLIC_PERFIX_CLASS}-container-box-content`]}
            >
              <div
                className={
                  styles[`${PUBLIC_PERFIX_CLASS}-container-box-content-text`]
                }
              >
                <div
                  className={
                    styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]
                  }
                >
                  存储过程类型：{detail.type}
                </div>
                <div
                  className={
                    styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]
                  }
                >
                  是否只读：{detail.read_only ? '是' : '否'}
                </div>
                <div
                  className={
                    styles[`${PUBLIC_PERFIX_CLASS}-container-box-text`]
                  }
                >
                  存储过程描述：{detail.description}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
