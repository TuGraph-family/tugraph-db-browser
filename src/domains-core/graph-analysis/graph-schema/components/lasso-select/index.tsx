/**
 * 图分析画布套索选择
 * ❗️需注意的是：如 updateBehavior 更新 behaviors 无效，注意查看初始化 graph 配置项 behaviors的key是否写入
 * 例如： 
       {
         key: 'drag-canvas', //交互 key，即唯一标识，未写入，updateBehavior无效
         type: 'drag-canvas',
        }
 */

import IconFont from '@/components/icon-font';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { Button, message, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';

const LassoSelect: React.FC = () => {
  const [state, setState] = useImmer<{ hasLasso: boolean }>({
    hasLasso: false,
  });
  const { hasLasso } = state;
  const { graph } = useSchemaGraphContext();

  const onLassoClick = () => {
    if (!hasLasso) {
      message.info('长按鼠标左键进行绘制');
    }
    setState(draft => {
      draft.hasLasso = !hasLasso;
    });
    //关闭画布拖拽，避免与套索drag冲突
    graph?.updateBehavior({
      key: 'drag-canvas',
      type: 'drag-canvas',
      enable: hasLasso,
    });
    //开启套索
    graph?.updateBehavior({
      key: 'lasso-select',
      type: 'lasso-select',
      enable: !hasLasso,
      //套索框选完成，关闭套索，恢复画布拖拽
      onSelect: (node: any) => {
        graph?.updateBehavior({
          key: 'lasso-select',
          type: 'lasso-select',
          enable: false,
        });
        graph?.updateBehavior({
          key: 'drag-canvas',
          type: 'drag-canvas',
          enable: true,
        });
        setState(draft => {
          draft.hasLasso = false;
        });
        return node;
      },
    });
  };
  //初始化向画布追加套索
  useEffect(() => {
    graph?.setBehaviors(pre => [
      ...pre,
      {
        key: 'lasso-select',
        type: 'lasso-select',
        enable: false,
        delegateStyle: {
          fill: '#f00',
          fillOpacity: 0.05,
          stroke: '#f00',
          lineWidth: 1,
        },
        trigger: 'drag',
        nodeStateStyles: {
          selected: {
            stroke: '#f00',
            lineWidth: 3,
          },
        },
      },
    ]);
  }, [graph]);

  return (
    <div>
      <Tooltip title={hasLasso ? '取消套索' : '套索'}>
        <Button
          type="link"
          icon={
            <IconFont
              type="icon-tugraph-lasso"
              style={{ fontSize: 20 }}
              onClick={onLassoClick}
            />
          }
        />
      </Tooltip>
    </div>
  );
};

export default LassoSelect;
