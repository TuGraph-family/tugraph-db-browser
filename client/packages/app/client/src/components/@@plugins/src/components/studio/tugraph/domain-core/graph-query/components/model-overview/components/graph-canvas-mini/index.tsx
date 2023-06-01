import { GraphinContext } from '@antv/graphin';
import { useContext, useEffect } from 'react';
import {
  GraphCanvas,
  GraphCanvasContext,
  useGraphinContext,
} from '../../../../../../components/garph-canvas';
import { GraphCanvasTools } from '../../../../../../components/graph-canvas-tools';
import { PUBLIC_PERFIX_CLASS } from '../../../../../../constant';

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
        className={[
          styles[`${PUBLIC_PERFIX_CLASS}-view-graph-model-canvas`],
          'view-graph-model-canvas',
        ].join(' ')}
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
