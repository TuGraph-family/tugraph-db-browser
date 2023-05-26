import { GraphinContext } from '@antv/graphin';
import React, { useCallback, useContext } from 'react';
import { useGraphinContext } from '../../../components/garph-canvas';
import IconFont from '../../../components/icon-font/index';

const AutoZoom: React.FC = () => {
  const { apis } = useGraphinContext();
  const { apis: contextApis } = useContext(GraphinContext);

  const onClick = useCallback(() => {
    if (apis) {
      apis.handleAutoZoom();
    }
    if (contextApis.handleAutoZoom) {
      contextApis.handleAutoZoom();
    }
  }, [apis, contextApis]);
  return (
    <div onClick={onClick}>
      <IconFont type="icon-compress" />
    </div>
  );
};

export default AutoZoom;
