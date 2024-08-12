import { cloneDeep } from 'lodash';
import { onFieldValueChange } from '@formily/core';
import { useFormEffects } from '@formily/react';
import React, { useEffect } from 'react';
import { allExpanded, defaultStyles, JsonView } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';
import { useImmer } from 'use-immer';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
import { OriginGraphData } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import styles from './index.less';

const GraphJsonView: React.FC = () => {
  const { getTabContainerValue, tabContainerIndex } = useSchemaTabContainer();
  const [state, setState] = useImmer<{ originGraphData: OriginGraphData }>({
    originGraphData: {},
  });
  const { originQueryData } = state.originGraphData;
  useFormEffects(() => {
    onFieldValueChange(
      `CanvasList.${tabContainerIndex}.originGraphData`,
      (field) => {
        setState((draft) => {
          draft.originGraphData = cloneDeep(field.value);
        });
      },
    );
  });

  useEffect(() => {
    const originGraphData = getTabContainerValue('originGraphData');
    setState((draft) => {
      draft.originGraphData = cloneDeep(originGraphData);
    });
  }, []);
  return (
    <div className={styles['graph-json-view']}>
      <JsonView
        data={originQueryData || []}
        shouldExpandNode={allExpanded}
        clickToExpandNode
        style={{ ...defaultStyles, container: 'json-container' }}
      />
    </div>
  );
};

export default GraphJsonView;
