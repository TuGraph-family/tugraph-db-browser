import {
  Collapse,
  Empty,
  Form,
  Input,
  List,
  message,
  Segmented,
  Space,
} from 'antd';
import copy from 'copy-to-clipboard';
import { filter, map } from 'lodash';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import IconFont from '../../../../../../components/icon-font';
import { TooltipText } from '../../../../../../components/tooltip-text';
import { PUBLIC_PERFIX_CLASS } from '../../../../../../constant';
import { EdgeProp, NodeProp } from '../../../../../../interface/schema';
import { SEGMENTED_OPTIONS } from '../../../../constant';

import styles from './index.module.less';

const { Panel } = Collapse;
type EdgeNodeListProp = {
  onSegmentedChange: (e: 'node' | 'edge') => void;
  onSearchChange: (val: string) => void;
  isNodeTab?: boolean;
  keyword?: string;
  graphData: { nodes: Array<any>; edges: Array<any> };
  width: number | string;
};
const EdgeNodeList: React.FC<EdgeNodeListProp> = ({
  onSegmentedChange,
  onSearchChange,
  isNodeTab,
  keyword,
  graphData,
  width,
}) => {
  const [state, setState] = useImmer<{
    renderList?: Array<NodeProp | EdgeProp>;
  }>({
    renderList: [],
  });
  const { renderList } = state;
  const { nodes, edges } = graphData;
  useEffect(() => {
    setState((draft) => {
      if (isNodeTab) {
        draft.renderList = nodes;
      } else {
        draft.renderList = edges;
      }
    });
  }, [isNodeTab, graphData]);
  const copyIcon = (text: string) => {
    return (
      <IconFont
        type="icon-fuzhi1"
        className={styles[`${PUBLIC_PERFIX_CLASS}-icon-copy`]}
        onClick={() => {
          copy(text);
          message.success('复制成功，可粘贴（⌘+V）到编辑器内使用');
        }}
      />
    );
  };

  const renderItem = map(renderList, (item: NodeProp | EdgeProp) => {
    const { properties, labelType, labelName, edgeConstraints } = item;
    const isNode = labelType === 'node';
    const color = isNode ? 'blue' : '#D77623';
    return (
      <Panel
        header={
          <div className={styles[`${PUBLIC_PERFIX_CLASS}-panel-header`]}>
            <Space direction="vertical" size={0}>
              <Space
                size={0}
                className={styles[`${PUBLIC_PERFIX_CLASS}-panel-header-title`]}
              >
                <IconFont
                  type={isNode ? 'icon-dian' : 'icon-bian'}
                  style={{ color, marginRight: 5 }}
                />
                <TooltipText
                  maxWidth={width - 180}
                  style={{
                    color: 'rgba(54,55,64,1)',
                    fontSize: '14px',
                  }}
                  text={<>{labelName || '-'}</>}
                />
                {copyIcon(labelName)}
              </Space>
              {!isNode && (
                <div
                  className={
                    styles[
                      `${PUBLIC_PERFIX_CLASS}-edge-node-list-item-description`
                    ]
                  }
                >
                  {map(edgeConstraints, (edgeList,idx) => (
                    <div key={idx}>
                      {edgeList[0] || '暂无数据'}
                      <IconFont type="icon-zhixiang" style={{ padding: 2 }} />
                      {edgeList[1] || '暂无数据'}
                    </div>
                  ))}
                </div>
              )}
            </Space>
          </div>
        }
        key={labelName}
      >
        <List
          size="small"
          bordered={false}
          dataSource={properties}
          renderItem={(item) => (
            <List.Item
              className={styles[`${PUBLIC_PERFIX_CLASS}-edge-node-list-item`]}
            >
              {item.name}
              {copyIcon(item.name)}
            </List.Item>
          )}
        />
      </Panel>
    );
  });
  return (
    <Form
      onValuesChange={(e) => {
        onSearchChange(e.keyword);
      }}
    >
      <div className={styles[`${PUBLIC_PERFIX_CLASS}-edge-node-list`]}>
        <Space
          className={styles[`${PUBLIC_PERFIX_CLASS}-edge-node-list-search`]}
        >
          <Segmented
            options={SEGMENTED_OPTIONS}
            size="small"
            onChange={(e) => onSegmentedChange(e as 'node' | 'edge')}
            value={isNodeTab ? 'node' : 'edge'}
          />
          <Form.Item noStyle initialValue={keyword} name="keyword">
            <Input
              suffix={
                <IconFont type="icon-sousuo" style={{ fontSize: '18px' }} />
              }
              allowClear
              size="small"
              placeholder={`请输入点或边名称`}
              autoComplete="off"
              onChange={(e) => {
                setState((draft) => {
                  draft.renderList = filter(
                    isNodeTab ? nodes : edges,
                    (item) => item.labelName.indexOf(e.target.value) !== -1
                  );
                });
              }}
            />
          </Form.Item>
        </Space>
        <Collapse
          ghost
          expandIcon={({ isActive }) => (
            <IconFont type="icon-caret-down" rotate={isActive ? 0 : -90} />
          )}
        >
          {renderList?.length ? (
            renderItem
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              className={styles[`${PUBLIC_PERFIX_CLASS}-empty`]}
            />
          )}
        </Collapse>
      </div>
    </Form>
  );
};

export default EdgeNodeList;
