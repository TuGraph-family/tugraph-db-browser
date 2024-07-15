import '@/assets/node-icons/iconfont.css';
import {
  GRAPH_SCHEMA,
  SchemaField,
} from '@/domains-core/graph-analysis/graph-schema/root';
import { Container } from '@/layouts';
import { parseSearch } from '@/utils/parseSearch';
import {
  createForm,
  onFieldValueChange,
  onFormInputChange,
} from '@formily/core';
import { FormProvider } from '@formily/react';
import { Spin } from 'antd';
import React, { useEffect, useMemo } from 'react';
import styles from './index.less';

const GraphSchema: React.FC = () => {
  const { env, graphId } = parseSearch(location.search) as any;

  // const {
  //   run: runGetGraphProjectDetail,
  //   loading: loadingGetGraphProjectDetail,
  // } = useRequest(GraphInfoService.getGraphProjectDetail, { manual: true });
  // const { run: runGetGraphLanguageList, loading: loadingGetGraphLanguageList } =
  //   useRequest(GraphInfoService.getGraphLanguageList, { manual: true });
  // const { run: runGetGraphSchema, loading: loadingGetGraphSchema } = useRequest(
  //   GraphInfoService.getGraphSchema,
  //   { manual: true },
  // );
  // const { run: runGetHtapOrderDetail } = useRequest(
  //   GraphInfoService.getHtapOrderDetail,
  //   { manual: true },
  // );
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
    // runGetGraphSchema({
    //   graphId,
    // }).then(data => {
    //   if (data) {
    //     const graphSchemaStyle = getStylesFromSchema(
    //       data.draftVisualModelDataVO,
    //     );
    //     const schema = getSchemaByEnv(data, env);
    //     form.setValuesIn('graphSchema', schema);
    //     form.setValuesIn('graphSchemaStyle', graphSchemaStyle);
    //   }
    // });
    // runGetHtapOrderDetail({
    //   graphId,
    // }).then(data => {
    //   form.setValuesIn('htapOrderDetail', data);
    // });
  }, []);

  return (
    <Container>
      <Spin
        spinning={
          // loadingGetGraphProjectDetail ||
          // loadingGetGraphLanguageList ||
          // loadingGetGraphSchema
          false
        }
      >
        <div className={styles['graph-schema']}>
          <FormProvider form={form}>
            <SchemaField schema={GRAPH_SCHEMA} />
          </FormProvider>
        </div>
      </Spin>
    </Container>
  );
};

export default GraphSchema;
