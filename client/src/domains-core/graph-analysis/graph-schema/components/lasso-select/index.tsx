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
import React, { useEffect } from 'react';
import { message } from 'antd';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';

const LassoSelect: React.FC = () => {
  const { graph } = useSchemaGraphContext();

  const onLassoClick = () => {
    message.info('长按鼠标左键进行绘制');
    //关闭画布拖拽，避免与套索drag冲突
    graph?.updateBehavior({
      key: 'drag-canvas',
      type: 'drag-canvas',
      enable: false,
    });
    //开启套索
    graph?.updateBehavior({
      key: 'lasso-select',
      type: 'lasso-select',
      enable: true,
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
        return node;
      },
    });
  };
  //初始化向画布追加套索
  useEffect(() => {
    graph?.setBehaviors((pre) => [
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
      <IconFont
        type="icon-tugraph-lasso"
        style={{ fontSize: 16, marginRight: 4 }}
        onClick={onLassoClick}
      />
    </div>
  );
};

export default LassoSelect;
