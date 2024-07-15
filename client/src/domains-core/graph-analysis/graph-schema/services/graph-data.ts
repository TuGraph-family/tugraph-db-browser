// import {
//   execute,
//   queryEdgeMaxHop,
//   queryNeighbors,
//   quickQuery,
//   shortestPath,
// } from '@/services/antgraphconsole/GeaMakerGraphAnalysisController';
// import {
//   executeQueryTemplate,
//   listQueryTemplate,
// } from '@/services/antgraphconsole/GeaMakerTemplateController';
// import { executeQueryTemplateTranslator } from '../translators/execute-query-template-translator';
// import { getPathServiceDataTranslator } from '../translators/get-path-service-data-translator';
// import { getTemplateListTranslator } from '../translators/get-template-list-translator';

// class QueryService {
//   public getTemplateList = (params: {
//     graphId?: number;
//     graphDeployEnvEnum?: API.GraphDeployEnvEnum;
//     geaMakerProductMode?: API.GeaMakerProductModeEnum;
//     keyword?: string;
//     current?: number;
//     pageSize?: number;
//   }) => {
//     return listQueryTemplate(params).then((res) =>
//       getTemplateListTranslator(res),
//     );
//   };
//   public excecuteTemplate = (
//     params: Parameters<typeof executeQueryTemplate>[0],
//     body: Parameters<typeof executeQueryTemplate>[1],
//   ) => {
//     return executeQueryTemplate(params, body).then((res) => {
//       return executeQueryTemplateTranslator(res);
//     });
//   };

//   public execute = execute;
//   public quickQueryGraphData = (body: Parameters<typeof queryNeighbors>[0]) => {
//     return quickQuery(body).then((res) => executeQueryTemplateTranslator(res));
//   };
//   public getShortestPath = (params: {
//     // query
//     /** 图项目id */
//     graphId?: number;
//     /** GraphDeployEnvEnum, 图计算存储计算资源服务所在的部署环境 */
//     graphDeployEnvEnum?: API.GraphDeployEnvEnum;
//     /** 起点 */
//     startId?: string;
//     startIdLabel?: string;
//     /** 终点 */
//     endId?: string;
//     endIdLabel?: string;
//     /** 深度 */
//     depth?: number;
//     /** 数量限制 */
//     limit?: number;
//     whetherHash?: boolean;
//     schemaEngineTypeEnum?: API.SchemaEngineTypeEnum;
//   }) => {
//     return shortestPath(params).then((res) => {
//       return {
//         ...res,
//         data: getPathServiceDataTranslator(res.data),
//       };
//     });
//   };

//   public queryEdgeMaxHop = queryEdgeMaxHop;
//   public queryNeighbors = (params: Parameters<typeof queryNeighbors>[0]) => {
//     return queryNeighbors(params).then((res) =>
//       executeQueryTemplateTranslator(res),
//     );
//   };
// }

// export default new QueryService();
