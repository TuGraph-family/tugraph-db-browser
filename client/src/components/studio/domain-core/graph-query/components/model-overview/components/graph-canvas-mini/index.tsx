import { GraphinContext } from '@antv/graphin';
import { join } from 'lodash';
import { useContext, useEffect } from 'react';
import {
  GraphCanvas,
  GraphCanvasContext,
  useGraphinContext,
} from '@/components/studio/components/garph-canvas';
import { GraphCanvasTools } from '@/components/studio/components/graph-canvas-tools';
import { PUBLIC_PERFIX_CLASS } from '@/components/studio/constant';

import styles from './index.module.less';

const GraphCanvasMini = ({
  getGraphCanvasContextValue,
  graphData,
  graphCanvasContextValue,
}: GraphCanvasMiniProps) => {
  const { apis } = useGraphinContext();
  const { apis: contextApis } = useContext(GraphinContext);
  useEffect(() => {
    if (apis) {
      apis.handleAutoZoom();
    }
    if (contextApis.handleAutoZoom) {
      contextApis.handleAutoZoom();
    }
  }, [apis, contextApis]);
  return (
    <GraphCanvasContext.Provider value={{ ...graphCanvasContextValue }}>
      <div
        className={join(
          [
            styles[`${PUBLIC_PERFIX_CLASS}-view-graph-model-canvas`],
            'view-graph-model-canvas',
          ],
          ' '
        )}
      >
        <GraphCanvas
          containerId="model-view"
          data={graphData}
          getGraphCanvasContextValue={getGraphCanvasContextValue}
          isPreview={true}
          style={{ background: '#fff' }}
        />
        <GraphCanvasTools />
      </div>
    </GraphCanvasContext.Provider>
  );
};

export default GraphCanvasMini;
