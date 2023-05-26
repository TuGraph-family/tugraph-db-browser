import { useGraphinContext } from '../../../components/garph-canvas';
import IconFont from '../../../components/icon-font/index';
import React, { useCallback, useContext } from 'react';
import { GraphinContext } from '@antv/graphin';

const RealZoom: React.FC = () => {
  const { apis } = useGraphinContext();
  const { apis: contextApis } = useContext(GraphinContext);

  const onClick = useCallback(() => {
    if (apis) {
      apis.handleRealZoom();
    }
    if (contextApis.handleRealZoom) {
      contextApis.handleRealZoom();
    }
  }, [apis, contextApis]);
  return (
    <div onClick={onClick}>
      <IconFont type="icon-icon-test" />
    </div>
  );
};

export default RealZoom;
