import {
  ArrowLeftOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Button, Modal } from 'antd';
import { join } from 'lodash';
import React, { useCallback } from 'react';
import { useImmer } from 'use-immer';
import { SplitPane } from '../../../../components/split-panle';
import TextTabs from '../../../../components/text-tabs';
import { PUBLIC_PERFIX_CLASS } from '../../../../constant';
import { StoredCheckoutDrawer } from './stored-checkout';
import { StoredKhopPanle } from './stored-khop-panle';
import { StoredList } from './stored-list';
import { StoredResult } from './stored-result';

import styles from './index.module.less';

type Props = {
  visible: boolean;
  onCancel: () => void;
};
export const StoredProcedureModal: React.FC<Props> = ({
  visible,
  onCancel,
}) => {
  const [state, updateState] = useImmer<{
    height: number;
    tabs: { text: string; key: string }[];
    activeTab: string;
    drawerVisible: boolean;
  }>({
    height: 362,
    tabs: [{ text: 'C++', key: '1' }],
    activeTab: '1',
    drawerVisible: false,
  });
  const { height, tabs, activeTab, drawerVisible } = state;
  const onSplitPaneHeightChange = useCallback((size: number) => {
    updateState((draft) => {
      draft.height = size;
    });
  }, []);
  const ActionBar = (
    <div
      className={
        styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-bar`]
      }
    >
      <Button type="primary" icon={<div></div>}>
        执行
      </Button>
      <Button
        onClick={() => {
          updateState((draft) => {
            draft.drawerVisible = true;
          });
        }}
        type="text"
        icon={<EyeOutlined />}
      >
        查看源码
      </Button>
      <Button type="text" icon={<DownloadOutlined />}>
        下载
      </Button>
      <Button type="text" icon={<DeleteOutlined />}>
        卸载
      </Button>
      <Button type="text" icon={<DownloadOutlined />}>
        Dome下载
      </Button>
    </div>
  );
  return (
    <Modal
      className={styles[`${PUBLIC_PERFIX_CLASS}-stored-modal`]}
      mask={false}
      visible={visible}
      onCancel={onCancel}
      closable={false}
      title={
        <>
          <ArrowLeftOutlined onClick={onCancel} />
          <span>存储过程</span>
        </>
      }
    >
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-content`]}>
        <StoredList />
        <div
          className={join(
            [
              styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-content-right`],
              styles[`${PUBLIC_PERFIX_CLASS}-split-pane`],
            ],
            ' '
          )}
        >
          <SplitPane
            split="horizontal"
            defaultSize={height}
            onChange={onSplitPaneHeightChange}
          >
            <div
              className={
                styles[`${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-top`]
              }
            >
              <TextTabs
                type="card"
                tabs={tabs}
                activeTab={activeTab}
                autoWidth={false}
              />
              {ActionBar}
              <div
                className={
                  styles[
                    `${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-top-content`
                  ]
                }
              >
                <StoredKhopPanle />
              </div>
            </div>
            <div
              className={
                styles[
                  `${PUBLIC_PERFIX_CLASS}-stored-modal-content-right-bottom`
                ]
              }
            >
              <StoredResult />
            </div>
          </SplitPane>
        </div>
      </div>
      <StoredCheckoutDrawer
        value={''}
        visible={drawerVisible}
        onClose={() => {
          updateState((draft) => {
            draft.drawerVisible = false;
          });
        }}
      />
    </Modal>
  );
};
