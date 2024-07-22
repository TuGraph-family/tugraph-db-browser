import CypherEdit from '@/components/studio/domain-core/graph-query/cypherEditor';
import { parseSearch } from '@/utils/parseSearch';
import { useRequest } from 'ahooks';
import { isEmpty, map } from 'lodash';
import { FileTextOutlined } from '@ant-design/icons';
import { GraphData } from '@antv/g6';
import type { RadioChangeEvent } from 'antd';
import { Button, Checkbox, message, Radio } from 'antd';
import React, { memo, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import { useSchemaGraphContext } from '@/domains-core/graph-analysis/graph-schema/contexts';
import { useSchemaFormValue } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-form-value/';
import { useSchemaTabContainer } from '@/domains-core/graph-analysis/graph-schema/hooks/use-schema-tab-container';
// import QueryService from '@/domains-core/graph-analysis/graph-schema/services/graph-data';
import { mergeGraphData } from '@/domains-core/graph-analysis/graph-schema/utils/merge-graph-data';
import styles from './index.less';

export interface ILanguageQueryProps {
  height?: string;
  languageServiceId: string;
}

const LanguageQuery: React.FC<ILanguageQueryProps> = ({ height = '320px' }) => {
  const { graphLanguageList, graphEngineType } = useSchemaFormValue();

  const { tabContainerField } = useSchemaTabContainer();
  // Todo: by Allen
  const { run: runExecute, loading: loadingExecute } = useRequest(
    // QueryService.execute,
    async() => {},
    { manual: true },
  );
  const { graph } = useSchemaGraphContext();

  const { graphId, env } = parseSearch(location.search) as any;

  const dataConfigEditorRef = useRef<any | null>(null);

  const [state, setState] = useImmer<{
    languageType?: any;
    editorValue: string;
    hasClear: boolean;
  }>({
    editorValue: 'MATCH (n) RETURN n',
    hasClear: true,
  });

  const { languageType, editorValue, hasClear } = state;

  useEffect(() => {
    if (!isEmpty(graphLanguageList)) {
      setState((draft) => {
        draft.languageType = graphLanguageList?.[0]?.value;
      });
    }
  }, [graphLanguageList]);

  const handleChangeEditorValue = (value: string) => {
    setState((draft) => {
      draft.editorValue = value;
    });
  };

  const handleClickQuery = async () => {
    tabContainerField.setComponentProps({
      spinning: true,
    });

    const graphData = await runExecute(
      // {
      //   gql: editorValue,
      //   languageType,
      //   schemaEngineTypeEnum: graphEngineType,
      //   graphId,
      //   graphDeployEnvEnum: env,
      // }
    );

    if (graphData?.nodes?.length === 0) {
      message.warn('未查询到符合条件的节点');
      return;
    }

    if (hasClear) {
      graph?.setData(graphData as GraphData);
    } else {
      if (graph) {
        // 在画布上叠加数据
        const originData = graph.getData();
        const newData = mergeGraphData(originData, graphData);
        graph?.setData(newData);
      }
    }
    graph?.render();
    tabContainerField.setComponentProps({
      spinning: false,
    });
  };

  const handleChange = (e: RadioChangeEvent) => {
    setState((draft) => {
      draft.hasClear = e.target.checked;
    });
  };

  const handleReset = () => {
    setState((draft) => {
      draft.editorValue = '';
      dataConfigEditorRef?.current?.getEditor()?.setValue('');
    });
  };

  return (
    <div className={[styles['language-query-container']].join(' ')}>
      <div className={styles['content-container']}>
        <div className={styles['title-group']}>
          <span className={styles['text-label-icon']}>输入语句</span>
          <a
              onClick={() => {
                window.open(
                  'https://tugraph-db.readthedocs.io/zh-cn/latest/8.query/1.cypher.html?highlight=cypher',
                );
              }}
            >
              <FileTextOutlined />
              语法说明
            </a>
        </div>
        <div className={styles['block-container']}>
          {/* <GraphEditor
            height={height}
            isReadOnly={false}
            initialValue={editorValue}
            onChange={(value: string) => handleChangeEditorValue(value)}
            graphEditorRef={dataConfigEditorRef}
            graphId={graphId}
            env={env}
          /> */}
          <CypherEdit
            ref={dataConfigEditorRef}
            value={editorValue}
            onChange={(value: string) => handleChangeEditorValue(value)}
          />
        </div>

        <Checkbox checked={hasClear} onChange={handleChange}>
          清空画布数据
        </Checkbox>
      </div>
      <div className={styles['button-container']}>
        <Button disabled={!editorValue} onClick={handleReset}>
          重置
        </Button>
        <Button
          className={styles['query-button']}
          loading={loadingExecute}
          type="primary"
          disabled={!editorValue}
          onClick={handleClickQuery}
        >
          查询
        </Button>
      </div>
    </div>
  );
};

export default memo(LanguageQuery);
