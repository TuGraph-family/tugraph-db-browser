import { DeleteOutlined } from '@ant-design/icons';
import { Popconfirm, Tooltip, message } from 'antd';
import copy from 'copy-to-clipboard';
import { filter, join } from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { useImmer } from 'use-immer';
import IconFont from '@/components/studio/components/icon-font';
import SearchInput from '@/components/studio/components/search-input';
import SwitchDrawer from '@/components/studio/components/switch-drawer';
import TextTabs from '@/components/studio/components/text-tabs';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';
import { useVisible } from '@/components/studio/hooks/useVisible';

import styles from './index.module.less';
interface NodeProp {
  id: string;
  label: string;
  type: string;
  style: any;
  labelName: string;
}
interface EdgeProp {
  id?: string;
  label?: string;
  type?: string;
  style: any;
  source: string;
  target: string;
  labelName: string;
}

export type NodesEdgesListTab = 'node' | 'edge';
export interface NodesEdgesListProps {
  onClick: (value?: any, activeTab?: string) => void;
  graphName: string;
  currentStep?: number;
  data?: {
    nodes: Array<NodeProp>;
    edges: Array<EdgeProp>;
  };
  onDelete?: (labelName: string, type?: string) => void;
  isActiveItem?: boolean;
}

const NodesEdgesList: React.FC<NodesEdgesListProps> = ({
  onClick,
  currentStep = 0,
  data = { nodes: [], edges: [] },
  graphName,
  onDelete,
  isActiveItem,
}) => {
  const { visible, onShow, onClose } = useVisible({ defaultVisible: true });
  const [state, setState] = useImmer<{
    activeElementId?: string;
    activeTab: string;
    nodes: Array<NodeProp>;
    edges: Array<EdgeProp>;
    nodesTotal: number;
    edgeTotal: number;
  }>({
    activeTab: 'node',
    nodes: [...data.nodes],
    edges: [...data.edges],
    nodesTotal: data.nodes.length,
    edgeTotal: data.edges.length,
  });
  const { activeElementId, activeTab, edges, nodes, nodesTotal, edgeTotal } =
    state;
  useEffect(() => {
    setState(draft => {
      draft.nodesTotal = data.nodes.length;
      draft.edgeTotal = data.edges.length;
      draft.edges = [...data.edges];
      draft.nodes = [...data.nodes];
    });
  }, [data]);

  const isNodeTab = useMemo(() => activeTab === 'node', [activeTab]);

  return (
    <SwitchDrawer
      visible={visible}
      onShow={onShow}
      onClose={onClose}
      position="left"
      className={styles[`${PUBLIC_PERFIX_CLASS}-nodes-edges-drawer`]}
      width={260}
    >
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-nodes-edges-content`]}>
        <div style={{ overflow: 'hidden' }}>
          <TextTabs
            type="card"
            onChange={value => {
              setState(draft => {
                draft.activeTab = value;
              });
            }}
            activeTab={activeTab}
            tabs={[
              {
                key: 'node',
                text: (
                  <div
                    className={join(
                      [styles[`${PUBLIC_PERFIX_CLASS}-title`], 'title'],
                      ' ',
                    )}
                  >
                    点类型
                    <span
                      className={join(
                        [styles[`${PUBLIC_PERFIX_CLASS}-total`], 'total'],
                        ' ',
                      )}
                    >
                      {nodesTotal}
                    </span>
                  </div>
                ),
              },
              {
                key: 'edge',
                text: (
                  <div
                    className={join(
                      [styles[`${PUBLIC_PERFIX_CLASS}-title`], 'title'],
                      ' ',
                    )}
                  >
                    边类型
                    <span
                      className={join(
                        [styles[`${PUBLIC_PERFIX_CLASS}-total`], 'total'],
                        ' ',
                      )}
                    >
                      {edgeTotal}
                    </span>
                  </div>
                ),
              },
            ]}
          />
        </div>

        <div className={styles[`${PUBLIC_PERFIX_CLASS}-content`]}>
          <SearchInput
            className={styles[`${PUBLIC_PERFIX_CLASS}-content-search`]}
            placeholder={`请输入搜索关键字`}
            onChange={e => {
              setState(draft => {
                if (isNodeTab) {
                  draft.nodes = filter(
                    data.nodes,
                    item => item.labelName.indexOf(e.target.value) !== -1,
                  );
                } else {
                  draft.edges = filter(
                    data.edges,
                    item =>
                      (item.id || item.labelName).indexOf(e.target.value) !==
                      -1,
                  );
                }
              });
            }}
          />
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-content-list`]}>
            {(isNodeTab ? nodes : edges).map(item => {
              const isActive =
                activeElementId === item.labelName && isActiveItem;
              const styleList = [
                styles[`${PUBLIC_PERFIX_CLASS}-content-list-item`],
              ];
              if (isActive) {
                styleList.push(
                  styles[`${PUBLIC_PERFIX_CLASS}-content-list-item-active`],
                );
              }
              return (
                <div className={join(styleList, ' ')} key={item.labelName}>
                  <div
                    className={styles[`${PUBLIC_PERFIX_CLASS}-element-type`]}
                    onClick={() => {
                      setState(draft => {
                        draft.activeElementId = item.labelName;
                      });
                      onClick(item, activeTab);
                    }}
                  >
                    {item.labelName}
                    <div
                      className={
                        styles[`${PUBLIC_PERFIX_CLASS}-element-type-icon`]
                      }
                    >
                      <Tooltip title="复制">
                        <IconFont
                          onClick={e => {
                            e.stopPropagation();
                            copy(item.labelName);
                            message.success('复制成功');
                          }}
                          type="icon-fuzhi1"
                          style={{ marginRight: 8, fontSize: 16 }}
                        />
                      </Tooltip>
                      <Popconfirm
                        title="确定要删除吗"
                        onConfirm={e => {
                          e?.stopPropagation();
                          onDelete?.(item.labelName, activeTab);
                        }}
                      >
                        <Tooltip title="删除">
                          <DeleteOutlined />
                        </Tooltip>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </SwitchDrawer>
  );
};

export default NodesEdgesList;
