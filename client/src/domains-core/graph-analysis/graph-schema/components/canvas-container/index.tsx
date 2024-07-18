import { Spin } from 'antd';
import { Resizable, ResizableProps, ResizeCallback } from 're-resizable';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import { GraphSchemaContextValue, SchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { resizeCanvas } from '@/domains-core/graph-analysis/graph-schema/utils/resize-canvas';
import styles from './index.less';

interface CanvasContainerProps {
  children: React.ReactNode;
  spinning?: boolean;
  defaultResizableHeight: string | number;
}

const CanvasContainer: React.FC<CanvasContainerProps> = (props) => {
  const { children, spinning, defaultResizableHeight } = props;
  const [context, updateContextValue] = useImmer<GraphSchemaContextValue>({});
  const [state, setState] = useImmer<{ size: ResizableProps['size'] }>({
    size: { width: '100%', height: '100%' },
  });
  const { size } = state;
  const onResizeStop: ResizeCallback = (e, direction, ref, d) => {
    setState((draft) => {
      const prevHeight = Number(draft.size!.height);
      draft.size!.height = isNaN(prevHeight)
        ? 500 + d.height
        : prevHeight + d.height;
    });
    resizeCanvas({ graph: context.graph });
  };
  useEffect(() => {
    setState((draft) => {
      draft.size!.height = defaultResizableHeight;
    });
  }, [defaultResizableHeight]);
  useEffect(() => {
    if (context.graph) {
      resizeCanvas({ graph: context.graph });
    }
  }, [context.graph]);
  return (
    <SchemaGraphContext.Provider value={{ ...context, updateContextValue }}>
      <Resizable
        minHeight={600}
        onResizeStop={onResizeStop}
        size={size}
        enable={{
          top: false,
          right: false,
          bottom: true,
          left: false,
          topRight: false,
          bottomRight: false,
          bottomLeft: false,
          topLeft: false,
        }}
      >
        <div
          className={[styles['canvas-container'], 'canvas-container'].join(' ')}
        >
          <Spin spinning={!!spinning}>{children}</Spin>
        </div>
      </Resizable>
    </SchemaGraphContext.Provider>
  );
};

export default CanvasContainer;
