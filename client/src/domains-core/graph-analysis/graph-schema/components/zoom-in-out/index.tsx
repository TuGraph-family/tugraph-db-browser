import IconFont from '@/components/icon-font';
import { throttle } from '@antv/util';
import React, { RefObject, useRef } from 'react';

import { onFieldValueChange } from '@formily/core';
import { useFormEffects } from '@formily/react';
import { useImmer } from 'use-immer';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import styles from './index.less';

const ZoomInOut = () => {
  const { graph } = useSchemaGraphContext();
  const { tabContainerIndex } = useSchemaTabContainer();
  const [state, setState] = useImmer<{ isHideZoomBtn: boolean }>({
    isHideZoomBtn: true,
  });
  const { isHideZoomBtn } = state;

  useFormEffects(() => {
    onFieldValueChange(
      `CanvasList.${tabContainerIndex}.originGraphData`,
      (field) => {
        setState((draft) => {
          draft.isHideZoomBtn = !field?.value?.graphData?.nodes?.length;
        });
      },
    );
  });

  const nodeRef: any = useRef({
    timer: null,
    width: 140,
    height: 124,
    holdOn: false,
    drag: false,
    mapHeight: 92,
    toolbarHeight: 32,
    offsetX: 0,
    scale: 1,
    pull: 16,
  });
  const realNodeRef: RefObject<any> = useRef(null);

  const fn = throttle(
    (e: { clientX: number }) => {
      const upScale = e.clientX < nodeRef.current.offsetX;
      if (nodeRef.current.holdOn) {
        if (upScale) {
          nodeRef.current.scale = nodeRef.current.scale + 0.1;
          realNodeRef.current.style.transform = `scale(${nodeRef.current.scale})`;
          realNodeRef.current.style.bottom =
            (nodeRef.current.scale - 1) * 60 + nodeRef.current.pull + 'px';
          realNodeRef.current.style.right =
            (nodeRef.current.scale - 1) * 64 + nodeRef.current.pull + 'px';
        } else {
          nodeRef.current.scale = nodeRef.current.scale - 0.1;
          realNodeRef.current.style.transform = `scale(${nodeRef.current.scale})`;
          realNodeRef.current.style.bottom =
            (nodeRef.current.scale - 1) * 60 + nodeRef.current.pull + 'px';
          realNodeRef.current.style.right =
            (nodeRef.current.scale - 1) * 64 + nodeRef.current.pull + 'px';
        }
      }
    },
    60,
    {
      trailing: true,
    },
  );
 

  if (isHideZoomBtn) return null;

  return (
    <div
      className={styles['zoomInOut']}
      ref={realNodeRef}
      draggable
      onMouseDown={() => {
        nodeRef.current.timer = setTimeout(() => {
          nodeRef.current.holdOn = true;
          realNodeRef.current.style.borderColor = '#3056e3';
        }, 1000);
      }}
      onMouseUp={() => {
        if (nodeRef.current.timer) {
          clearTimeout(nodeRef.current.timer);
        }
        nodeRef.current.holdOn = false;
        realNodeRef.current.style.borderColor = '#e9e9e9';
      }}
      onDragStart={(e) => {
        nodeRef.current.offsetX = e.clientX;
        nodeRef.current.drag = true;
      }}
      onDrag={(e) => {
        if (nodeRef.current.drag && nodeRef.current.holdOn) {
          fn(e);
        }
      }}
      onDragEnd={() => {
        nodeRef.current.drag = false;
        realNodeRef.current.style.borderColor = '#e9e9e9';
      }}
    >
      <div className={styles['toolbar']}>
        <div
          className={[styles['toolbar-item']].join(' ')}
          onClick={() => {
            graph?.zoomBy(2);
          }}
        >
          <IconFont type="icon-zoomin" />
        </div>
        <div
          className={[styles['toolbar-item']].join(' ')}
          onClick={() => {
            graph?.zoomBy(0.5);
          }}
        >
          <IconFont type="icon-zoomout" />
        </div>
        <div
          className={[styles['toolbar-item']].join(' ')}
          onClick={() => {
            graph?.zoomTo(1);
          }}
        >
          <IconFont type="icon-huabu-1bi1" />
        </div>
        <div
          className={[styles['toolbar-item']].join(' ')}
          onClick={() => {
            graph?.fitView();
          }}
        >
          <IconFont type="icon-fullscreen" />
        </div>
      </div>
    </div>
  );
};

export default ZoomInOut;
