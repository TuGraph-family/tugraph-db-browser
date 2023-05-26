import { useGraphinContext } from '../../../components/garph-canvas';
import IconFont from '../../../components/icon-font/index';
import React, { useCallback, useContext } from 'react';
import { GraphinContext } from '@antv/graphin';
const ZoomOut: React.FC = () => {
  const { apis } = useGraphinContext();
  const { apis: contextApis } = useContext(GraphinContext);
  const onClick = useCallback(() => {
    if (apis) {
      apis.handleZoomOut();
    }
    if (contextApis.handleZoomOut) {
      contextApis.handleZoomOut();
    }
  }, [apis, contextApis]);
  return (
    <div onClick={onClick}>
      <IconFont type="icon-huabu-fangda" />
    </div>
  );
};

export default ZoomOut;
