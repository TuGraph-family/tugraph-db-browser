import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { List, Pagination, Spin } from 'antd';
import { useCallback, useEffect } from 'react';
import { useImmer } from 'use-immer';
import CollasibleSteps from '../components/collapsable-steps';
import { PROJECT_TAB, PUBLIC_PERFIX_CLASS, STEP_LIST } from '../constant';
import AddTuGraphModal from '../domain-core/project/project-list/components/add-tugraph';
import EmptyProject from '../domain-core/project/project-list/components/empty-project';
import ProjectCard from '../domain-core/project/project-list/components/project-card';
import { useGraph } from '../hooks/useGraph';
import { SubGraph } from '../interface/graph';
import { PluginPorps } from '../interface/openpiece';
import { getDefaultDemoList } from '../utils/getDefaultDemoList';
import { getZhPeriod } from '../utils/getZhPeriod';
import { getGraphListTranslator } from '../utils/graphTranslator';
import { getLocalData, setLocalData } from '../utils/localStorage';

import styles from './index.module.less';

export const GraphList = (props: PluginPorps) => {
  const redirectPath = props?.redirectPath;
  const { onGetGraphList, getGraphListLoading } = useGraph();

  const [state, updateState] = useImmer<{
    activeTab: PROJECT_TAB;
    searchType: 'project' | 'member';
    keyword: string;
    isShowStep: boolean;
    isConsoleMenu?: boolean;
    tabKey?: string;
    isEditPassword?: boolean;
    list: any[];
    isAdd: boolean;
    pagination: number;
    currentList: any[];
  }>({
    activeTab: 'MY_PROJECT',
    searchType: 'project',
    keyword: '',
    isShowStep: true,
    isConsoleMenu: false,
    tabKey: 'tuManage',
    isEditPassword: false,
    list: [],
    isAdd: false,
    pagination: 1,
    currentList: [],
  });
  const { keyword, isShowStep, list, isAdd, pagination, currentList } = state;
  const { projectListLoading } = {
    projectListLoading: '',
  };
  const onCollapse = useCallback(() => {
    setLocalData('TUGRAPH_LIST_SHOW_STEP', { isShowStep: !isShowStep });
    updateState((draft) => {
      draft.isShowStep = !isShowStep;
    });
  }, [isShowStep]);
  const getGraphList = () => {
    onGetGraphList({ userName: getLocalData('TUGRAPH_USER_NAME') }).then(
      (res) => {
        if (res.success) {
          setLocalData('TUGRAPH_SUBGRAPH_LIST', res.data);
          updateState((draft) => {
            const defaultList = getDefaultDemoList(
              getGraphListTranslator(res.data as SubGraph[])
            );
            draft.currentList = defaultList;
            draft.list = [
              ...defaultList.slice((pagination - 1) * 8, pagination * 8),
            ];
          });
        }
      }
    );
  };
  useEffect(() => {
    try {
      getGraphList();
    } catch (error) {
      console.error(error);
    }

    const localShowStep = getLocalData('TUGRAPH_LIST_SHOW_STEP');
    if (localShowStep) {
      updateState((draft) => {
        draft.isShowStep = localShowStep.isShowStep;
      });
    }
  }, []);
  const onCreateProject = useCallback(() => {
    updateState((draft) => {
      draft.isAdd = true;
    });
  }, []);
  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-home-style`]}>
      {state.tabKey === 'tuManage' && (
        <div className={styles[`${PUBLIC_PERFIX_CLASS}-graph-develop`]}>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-title`]}>
            {getZhPeriod()}，欢迎来到TuGraph～
          </div>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-desc`]}>
            <span className={styles[`${PUBLIC_PERFIX_CLASS}-desc-text`]}>
              {
                'TuGraph 是蚂蚁集团自主研发的单机版图数据库产品，特点是单机大数据量，高吞吐率，灵活的API，同时支持高效的在线事务处理（OLTP）和在线分析处理（OLAP）'
              }
            </span>
            <span
              onClick={onCollapse}
              className={styles[`${PUBLIC_PERFIX_CLASS}-desc-collapse`]}
            >
              <span
                className={styles[`${PUBLIC_PERFIX_CLASS}-desc-collapse-text`]}
              >
                {isShowStep ? '收起' : '展开'}
              </span>
              {isShowStep ? <UpOutlined /> : <DownOutlined />}
            </span>
          </div>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-steps`]}>
            <CollasibleSteps stepList={STEP_LIST} collapsed={!isShowStep} />
          </div>
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-projects`]}>
            <Spin spinning={getGraphListLoading}>
              {(currentList || []).length === 0 ? (
                <EmptyProject onCreateProject={onCreateProject} />
              ) : (
                <List
                  grid={{ column: 3, gutter: 16 }}
                  className={[
                    styles[`${PUBLIC_PERFIX_CLASS}-list`],
                    isShowStep
                      ? styles[`${PUBLIC_PERFIX_CLASS}-list-show-step`]
                      : '',
                  ].join(' ')}
                  dataSource={[{ id: '-1' } as any, ...(list || [])]}
                  renderItem={(item, index) => {
                    return (
                      <List.Item>
                        <ProjectCard
                          redirectPath={redirectPath}
                          key={item.graphName}
                          projectInfo={item}
                          index={index}
                          onRefreshProjectList={getGraphList}
                        />
                      </List.Item>
                    );
                  }}
                />
              )}
              <Pagination
                current={pagination}
                hideOnSinglePage
                total={currentList.length}
                pageSize={8}
                onChange={(value) => {
                  updateState((draft) => {
                    draft.pagination = value;
                    draft.list = [
                      ...currentList.slice((value - 1) * 8, value * 8),
                    ];
                  });
                }}
              />
            </Spin>
          </div>
        </div>
      )}
      <AddTuGraphModal
        open={isAdd}
        onClose={() => {
          updateState((draft) => {
            draft.isAdd = false;
            getGraphList();
          });
        }}
      />
    </div>
  );
};
