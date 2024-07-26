import IconFont from '@/components/icon-font';
import Handler from '@/domains-core/graph-analysis/graph-schema/components/drawer-handler';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { resizeCanvas } from '@/domains-core/graph-analysis/graph-schema/utils/resize-canvas/';
import { Resizable, ResizableProps, ResizeCallback } from 're-resizable';
import React, { useEffect } from 'react';
import { useImmer } from 'use-immer';
import styles from './index.less';

const MAX_WIDTH = 720;
const MIN_WIDTH = 350;

const getDefaultSideWidth = (propWidth?: number) => {
  const defaultWidth = propWidth || 350;
  return Number(defaultWidth);
};

interface CanvasSiderProps {
  resizableProps?: ResizableProps;
  children: React.ReactNode;
  handlerPosition: 'left' | 'right';
  visible?: boolean;
  width?: number;
  onSiderWidthChange?: (width: number) => void;
  showHandler?: boolean;
}

const CanvasSider: React.FC<CanvasSiderProps> = ({
  resizableProps,
  children,
  handlerPosition = 'left',
  width: propWidth,
  onSiderWidthChange,
  showHandler = true,
  visible = true,
}) => {
  const isLeft = handlerPosition === 'left';
  const { graph } = useSchemaGraphContext();
  const [state, setState] = useImmer<{ width: number; isExpanded: boolean }>({
    width: getDefaultSideWidth(propWidth),
    isExpanded: true,
  });
  const { width, isExpanded } = state;
  const onResizeStop: ResizeCallback = (e, direction, ref, d) => {
    if (!isExpanded) return;
    setState((draft) => {
      const currentWidth = draft.width + d.width;
      const realWidth =
        currentWidth >= MAX_WIDTH
          ? MAX_WIDTH
          : currentWidth <= MIN_WIDTH
          ? MIN_WIDTH
          : currentWidth;

      onSiderWidthChange?.(realWidth);
      // localStorage.setItem('GI_RICH_CONTAINER_SIDE_WIDTH', String(realWidth));
      draft.width = realWidth;
    });
    resizeCanvas({ graph });
  };
  useEffect(() => {
    if (isExpanded) {
      const defaultWidth = getDefaultSideWidth(propWidth);
      const isInRange = defaultWidth <= MAX_WIDTH && defaultWidth >= MIN_WIDTH;
      const width = isInRange
        ? defaultWidth
        : defaultWidth >= MAX_WIDTH
        ? MAX_WIDTH
        : MIN_WIDTH;
      setState((draft) => {
        draft.width = width;
      });
    } else {
      setState((draft) => {
        draft.width = 0;
      });
    }
    setTimeout(() => {
      resizeCanvas({ graph });
    }, 100);
  }, [isExpanded]);

  const toggleClick = () => {
    setState((draft) => {
      draft.isExpanded = !isExpanded;
    });
  };

  return visible ? (
    <div className={[styles['canvas-sider'], 'canvas-sider'].join(' ')}>
      <Resizable
        {...resizableProps}
        defaultSize={{ width }}
        style={{
          pointerEvents: 'all',
          backgroundColor: '#f7f9fc',
          zIndex: 10,
          padding: 12,
        }}
        size={{ width, height: '100%' }}
        onResizeStop={onResizeStop}
        className={styles['canvas-sider-resizable']}
      >
        <div
          className={styles['canvas-sider-content']}
          style={{ display: isExpanded ? 'block' : 'none' }}
        >
          {children}
        </div>
        {showHandler && (
          <Handler
            handlerPosition={handlerPosition}
            handleClick={toggleClick}
            icon={
              isLeft ? (
                <IconFont
                  type="icon-shituxiala"
                  rotate={isExpanded ? 90 : -90}
                />
              ) : (
                <IconFont
                  type="icon-shituxiala"
                  rotate={isExpanded ? -90 : 90}
                />
              )
            }
          />
        )}
      </Resizable>
    </div>
  ) : null;
};

export default CanvasSider;
