import { Tag, Tooltip } from 'antd';
import { find, join, omit } from 'lodash';
import React, { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import IconFont from '../../../../components/icon-font';
import TextTabs, { TextTabsTab } from '../../../../components/text-tabs';
import { PUBLIC_PERFIX_CLASS } from '../../../../constant';
import { ExcecuteResultProp } from '../../../../interface/query';
import { GraphData } from '../../../../interface/schema';
import { downloadFile } from '../../../../utils/downloadFile';
import ExecuteResult from '../excecute-result';

import styles from './index.module.less';

export interface ExcecuteQueryResult {
  result: {
    nodes?: Array<any>;
    edges?: Array<any>;
    message?: string;
  } | null;
  data: any;
  isSuccess: boolean;
  requestTime?: number;
}

interface ExcecuteHistoryProps {
  queryResultList: Array<ExcecuteResultProp & { id?: string }>;
  efficiencyResult?: any[];
  planResult?: any[];
  onResultClose?: (resultIndex?: string) => void;
  graphName: string;
  graphData: GraphData;
  lastResult: any,
  activeTabKey: string,
}

const ExcecuteResultPanle: React.FC<ExcecuteHistoryProps> = ({
  queryResultList,
  onResultClose,
  graphData,
  graphName,
  lastResult,
  activeTabKey,
}) => {
  const [state, setState] = useImmer<{
    tabs: TextTabsTab<string>[];
    activeTab?: string;
    isFullView: boolean;
    activeResult?: ExcecuteResultProp;
    modalOpen: boolean;
    
  }>({
    tabs: [{ text: '执行结果', key: 'result' }],
    activeTab: '',
    isFullView: false,
    modalOpen: false,
  });
  const { tabs, activeTab, isFullView, activeResult, modalOpen } = state;
  const onFullView = useCallback(() => {
    setState((draft) => {
      draft.isFullView = !isFullView;
    });
  }, [isFullView]);
  const fullViewButton = (
    <Tooltip
      title={isFullView ? '退出全屏' : '全屏显示'}
      placement={!isFullView ? 'top' : 'bottom'}
    >
      <IconFont
        type={isFullView ? 'icon-shouqiquanping' : 'icon-quanping'}
        onClick={onFullView}
      />
    </Tooltip>
  );
  const renderTabRightAction = () => {
    switch (activeTab) {
      case 'plan':
        return fullViewButton;
      default:
        return (
          <>
            <Tooltip
              title="插入数据"
              placement={!isFullView ? 'top' : 'bottom'}
            >
              <IconFont
                type="icon-charushuju"
                onClick={() => {
                  setState((draft) => {
                    draft.modalOpen = true;
                  });
                }}
              />
            </Tooltip>
            <Tooltip
              title="下载执行结果"
              placement={!isFullView ? 'top' : 'bottom'}
            >
              <IconFont
                type="icon-a-xiazaiyujujieguo"
                onClick={() => {
                  downloadFile(
                    JSON.stringify(omit(activeResult, 'id')),
                    '执行结果文本.txt'
                  );
                }}
              />
            </Tooltip>
            {fullViewButton}
          </>
        );
    }
  };
  useEffect(() => {
    if (queryResultList) {
      const id = lastResult?.[activeTabKey] || ''
      const activeTabIndex = queryResultList.findIndex(item=>item?.id === id)

      const idx =  activeTabIndex >= 0 ? activeTabIndex : queryResultList.length - 1
    
      const latestResult = queryResultList[idx];
      const newTabs = [
        ...(queryResultList || []).map((result, index) => ({
          text: (
            <div className={styles[`${PUBLIC_PERFIX_CLASS}-result-tab`]}>
              <Tooltip>
                执行结果{index + 1}
                <Tag
                  color={result.success ? 'success' : 'error'}
                  style={{ marginLeft: 6, fontSize: 12 }}
                >
                  {result.success ? '成功' : '失败'}
                </Tag>
              </Tooltip>
              <IconFont
                type="icon-shibai_guanbi"
                onClick={() => onResultClose?.(result?.id)}
                style={{ fontSize: 20 }}
              />
            </div>
          ),
          key: result.id,
        })),
      ];
      const activeTab = newTabs[idx].key;

      setState((draft) => {
        draft.tabs = newTabs as Array<{ text: React.ReactNode; key: string }>;
        draft.activeTab = activeTab;
        draft.activeResult = latestResult;
      });
    }
  }, [queryResultList]);
  return (
    <div
      className={join(
        [
          styles[`${PUBLIC_PERFIX_CLASS}-excecute-history`],
          isFullView
            ? styles[`${PUBLIC_PERFIX_CLASS}-excecute-history__full`]
            : '',
        ],
        ' '
      )}
    >
      <TextTabs
        type="card"
        tabs={tabs}
        activeTab={activeTab}
        autoWidth={false}
        onChange={(val) => {
          setState((draft) => {
            draft.activeResult = find(
              queryResultList,
              (result) => result.id === val
            );
          });
        }}
      />
      <div
        className={styles[`${PUBLIC_PERFIX_CLASS}-excecute-history-actions`]}
      >
        {renderTabRightAction()}
      </div>
      <div
        className={styles[`${PUBLIC_PERFIX_CLASS}-excecute-history-content`]}
      >
        <ExecuteResult
          excecuteResult={activeResult}
          graphName={graphName}
          graphData={graphData}
          modalOpen={modalOpen}
          onClose={() => {
            setState((draft) => {
              draft.modalOpen = false;
            });
          }}
        />
      </div>
    </div>
  );
};

export default ExcecuteResultPanle;
