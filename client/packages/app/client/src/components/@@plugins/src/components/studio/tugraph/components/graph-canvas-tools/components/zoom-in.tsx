import { useGraphinContext } from '../../../components/garph-canvas';
import IconFont from '../../../components/icon-font/index';
import React, { useCallback, useContext } from 'react';
import { GraphinContext } from '@antv/graphin';

const ZoomIn: React.FC = () => {
  const { apis } = useGraphinContext();
  const { apis: contextApis } = useContext(GraphinContext);

  const onClick = useCallback(() => {
    if (apis) {
      apis.handleZoomIn();
    }
    if (contextApis.handleZoomIn) {
      contextApis.handleZoomIn();
    }
  }, [apis, contextApis]);
  return (
    <div onClick={onClick}>
      <IconFont type="icon-huabu-suoxiao" />
    </div>
  );
};

export default ZoomIn;
