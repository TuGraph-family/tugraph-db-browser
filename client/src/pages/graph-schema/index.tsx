/**
 * author: Allen
 * file: graph analyze entry
 */

import React, { useEffect, useMemo } from 'react';
import { FormProvider } from '@formily/react';
import { Spin } from 'antd';
import {
  createForm,
  onFieldValueChange,
  onFormInputChange,
} from '@formily/core';
import {
  GRAPH_SCHEMA,
  SchemaField,
} from '@/domains-core/graph-analysis/graph-schema/root';

// components
import { Container } from '@/layouts';

// utils
import { parseHashRouterParams } from '@/utils/parseHash';

// style
import '@/assets/node-icons/iconfont.css';
import styles from './index.less';
import { useAnalysis } from '@/hooks/useAnalysis';
import { graphSchemaTranslator } from '@/domains-core/graph-analysis/graph-schema/translators/graph-schema-translator';

const GraphSchema: React.FC = () => {
  const { graphName } = parseHashRouterParams(location.hash);
  const { querySchema, querySchemaLoading } = useAnalysis();
  // Todo: by Allen
  // const {
  //   run: runGetGraphProjectDetail,
  //   loading: loadingGetGraphProjectDetail,
  // } = useRequest(GraphInfoService.getGraphProjectDetail, { manual: true });
  // const { run: runGetGraphLanguageList, loading: loadingGetGraphLanguageList } =
  //   useRequest(GraphInfoService.getGraphLanguageList, { manual: true });

  const form = useMemo(() => {
    return createForm({
      effects() {
        onFormInputChange(form => {
          // console.log(form.fields);
          console.log(JSON.parse(JSON.stringify(form.values)));
        });

        onFieldValueChange('graphEngineType', (field, form) => {
          const graphEngineType = field.value;
          // runGetGraphLanguageList({
          //   graphId: graphId,
          //   schemaEngineTypeEnum: graphEngineType,
          // }).then(data => {
          //   if (data) {
          //     const graphLanguageList = envGraphLanguageTranslator(data, env);
          //     form.setValuesIn('graphLanguageList', graphLanguageList);
          //   }
          // });
        });
        onFieldValueChange('graphProjectInfo', (field, form) => {
          const graphDisplayName = field.value?.graphDisplayName;
          if (graphDisplayName) {
            form.setValuesIn('Header.HeaderLeft.PageTitle', graphDisplayName);
          }
        });
      },
    });
  }, []);

  useEffect(() => {
    // runGetGraphProjectDetail({ env, graphManageId: graphId }).then(data => {
    //   if (data) {
    //     form.setValues({
    //       graphProjectInfo: data,
    //       graphEngineType: getEngineTypeByEnv(data, env),
    //     });
    //   }
    // });
    querySchema({
      graphName,
    }).then(data => {
      if (data) {
        const { schema } = data.data?.[0]?.schema || {};
        // const graphSchemaStyle = getStylesFromSchema(
        //   data.draftVisualModelDataVO,
        // );

        form.setValuesIn('graphSchema', graphSchemaTranslator(schema));
        // form.setValuesIn('graphSchemaStyle', graphSchemaStyle);
      }
    });
  }, []);

  return (
    <Container>
      <Spin
        spinning={
          // loadingGetGraphProjectDetail ||
          // loadingGetGraphLanguageList ||
          querySchemaLoading
        }
      >
        <div
          className={`
            ${styles['graph-schema']}
            ${
              form?.fields['Header.HeaderRight.PageLayout']?.value === 'Tab'
                ? styles['graph-schema-tab']
                : ''
            }`
          }
        >
          <FormProvider form={form}>
            <SchemaField schema={GRAPH_SCHEMA} />
          </FormProvider>
        </div>
      </Spin>
    </Container>
  );
};

export default GraphSchema;
