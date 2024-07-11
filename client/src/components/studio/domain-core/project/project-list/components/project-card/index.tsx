import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { ProCard } from '@ant-design/pro-components';
import { Card, message, Popconfirm, Spin, Tooltip } from 'antd';
import { useImmer } from 'use-immer';
import IconFont from '../../../../../components/icon-font';
import { PUBLIC_PERFIX_CLASS, TUGRAPH_DEOM } from '../../../../../constant';
import { useGraph } from '../../../../../hooks/useGraph';
import AddTuGraphModal from '../add-tugraph';
import EditTuGraphMoadl from '../edit-tugraph';
import styles from './index.module.less';
import { useEffect } from 'react';

interface CardProps {
  projectInfo: any;
  index: number;
  onRefreshProjectList: () => void;
}
const { Meta } = Card;
const ProjectCard = ({
  projectInfo,
  index,
  onRefreshProjectList,
}: CardProps) => {
  const {
    onDeleteGraph,
    onGetNodeEdgeStatistics,
    getNodeEdgeStatisticsLoading,
  } = useGraph();
  const { graphName, description, maxSizeGB, isDisabledButton, id } =
    projectInfo || {};
  const [state, updateState] = useImmer<{
    drawerVisiable?: boolean;
    isEdit: boolean;
    isAdd: boolean;
    nodeEdgeObjList?: Array<{ text: string; value?: number }>;
    isNodeEdgeObj: boolean;
    isConstruct: boolean;
  }>({
    drawerVisiable: false,
    isEdit: false,
    isAdd: false,
    nodeEdgeObjList: [],
    isNodeEdgeObj: false,
    isConstruct: false,
  });
  const { nodeEdgeObjList, isNodeEdgeObj,isConstruct } = state;
  const getActions = (text: string, status: boolean, href: string) => (
    <Tooltip title={!status && '请先图构建'}>
      <span
        onClick={() => {
          if (status) {
            window.location.hash = href || '';
          }
        }}
        className={
          status
            ? styles[`${PUBLIC_PERFIX_CLASS}-action-button`]
            : styles[`${PUBLIC_PERFIX_CLASS}-disabled-action-buttonButton`]
        }
      >
        {text}
      </span>
    </Tooltip>
  );
  // 点边统计
  const nodeEdgeStatistics = (graphName: string) => {
    updateState(draft => {
      draft.isNodeEdgeObj = true;
    });
    onGetNodeEdgeStatistics(graphName).then(res => {

      if (res.success) {
        const isConstruct = !!(res.data.vertexLabels || res.data.edgeLabels)
        updateState(draft => {
          draft.nodeEdgeObjList = [
            { text: '类点', value: res.data.vertexLabels },
            { text: '点', value: res.data.vertexCount },
            { text: '类边', value: res.data.edgeLabels },
            { text: '边', value: res.data.edgeCount },
          ];
          draft.isConstruct = isConstruct
        });
      }
    });
  };
  useEffect(()=>{
    nodeEdgeStatistics(graphName)
  },[])

  return (
    <div className={styles[`${PUBLIC_PERFIX_CLASS}-card-box`]}>
      {index === 0 ? (
        <ProCard
          direction="column"
          bordered={false}
          layout="center"
          hoverable
          className={styles[`${PUBLIC_PERFIX_CLASS}-create-card`]}
          onClick={() => {
            updateState(draft => {
              draft.isAdd = true;
            });
          }}
        >
          <IconFont
            type="icon-xinjiantuxiangmudeicon"
            className={styles[`${PUBLIC_PERFIX_CLASS}-plus-icon`]}
          />
          <div style={{ color: '#1650ff', fontSize: '16px' }}>新建图项目</div>
        </ProCard>
      ) : (
        <Card
          actions={[
            getActions(
              '图构建',
              true,
              `${'/construct'}?graphName=${graphName}`,
            ),
            getActions('图查询', isConstruct, `${'/query'}?graphName=${graphName}`),
            getActions('图分析', false, `${'/analysis'}?graphName=${graphName}`),
          ]}
          bordered={false}
          hoverable
          className={styles[`${PUBLIC_PERFIX_CLASS}-card`]}
        >
          <Meta
            className={styles[`${PUBLIC_PERFIX_CLASS}-card-meta-box`]}
            title={
              <>
                <div className={styles[`${PUBLIC_PERFIX_CLASS}-meta-header`]}>
                  <div
                    title={graphName}
                    className={
                      styles[`${PUBLIC_PERFIX_CLASS}-graph-display-name`]
                    }
                  >
                      <Tooltip title={graphName}>{graphName}</Tooltip>
                  </div>
                  <div
                    className={
                      styles[`${PUBLIC_PERFIX_CLASS}-header-right-box`]
                    }
                  >
                    {!nodeEdgeObjList?.length ? (
                      <Tooltip title="点边统计">
                        <IconFont
                          onClick={() => {
                            nodeEdgeStatistics(graphName);
                          }}
                          type="icon-dianbiantongji"
                          style={{
                            fontSize: '16px',
                            color: `rgba(152, 152, 157, 1)`,
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip title="刷新">
                        <ReloadOutlined
                          onClick={() => {
                            nodeEdgeStatistics(graphName);
                          }}
                          style={{
                            color: `rgba(152, 152, 157, 1)`,
                            fontSize: 14,
                          }}
                        />
                      </Tooltip>
                    )}
                
                      <Popconfirm
                        placement="top"
                        title={`你确定将子图「${graphName}」永久删除吗？`}
                        onConfirm={() => {
                          onDeleteGraph({ graphName }).then(res => {
                            if (res?.success) {
                              onRefreshProjectList();
                              message.success('删除成功');
                            }
                          });
                        }}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Tooltip title="删除">
                          <DeleteOutlined
                            style={{ color: `rgba(152, 152, 157, 1)` }}
                          />
                        </Tooltip>
                      </Popconfirm>
                  
                    <Tooltip title="编辑">
                      <IconFont
                        type="icon-bianjimoxing"
                        onClick={() => {
                          updateState(draft => {
                            draft.isEdit = true;
                          });
                        }}
                        style={{
                          color: `rgba(152, 152, 157, 1)`,
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
                {isNodeEdgeObj ? (
                  getNodeEdgeStatisticsLoading ? (
                    <Spin
                      indicator={<IconFont type="icon-jiazai" />}
                      tip={<span>正在统计中，请稍等片刻</span>}
                      spinning
                    />
                  ) : (
                    <div
                      className={styles[`${PUBLIC_PERFIX_CLASS}-env-node-edge`]}
                    >
                      {nodeEdgeObjList?.map(item => {
                        return (
                          <div
                            className={
                              styles[`${PUBLIC_PERFIX_CLASS}-tetx-box`]
                            }
                            key={item.text}
                          >
                            <div
                              className={styles[`${PUBLIC_PERFIX_CLASS}-text`]}
                            >
                              {((item.text === '点' || item.text === '边') &&
                                !isNodeEdgeObj) ||
                              !item.value
                                ? '--'
                                : item.value}
                            </div>
                            <div
                              className={
                                styles[`${PUBLIC_PERFIX_CLASS}-little-text`]
                              }
                            >
                              {item.text}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                ) : (
                  <div
                    className={
                      styles[`${PUBLIC_PERFIX_CLASS}-null-env-node-edge`]
                    }
                  >
                    <span>
                      暂无点边数据
                      <Tooltip
                        title={isDisabledButton && '暂不可操作，请先完成图构建'}
                      >
                        <a
                          className={
                            isDisabledButton
                              ? styles[
                                  `${PUBLIC_PERFIX_CLASS}-disabled-action-buttonButton`
                                ]
                              : styles[`${PUBLIC_PERFIX_CLASS}-action-button`]
                          }
                          onClick={() => {
                            nodeEdgeStatistics(graphName);
                          }}
                        >
                          点击统计
                        </a>
                      </Tooltip>
                    </span>
                  </div>
                )}
              </>
            }
          />
        </Card>
      )}

      <EditTuGraphMoadl
        open={state.isEdit}
        detail={{ graphName, description, maxSizeGB }}
        onClose={() => {
          updateState(draft => {
            draft.isEdit = false;
          });
        }}
        onRefreshProjectList={onRefreshProjectList}
      />
      <AddTuGraphModal
        open={state.isAdd}
        onClose={() => {
          updateState(draft => {
            draft.isAdd = false;
          });
          onRefreshProjectList();
        }}
      />
    </div>
  );
};
export default ProjectCard;
