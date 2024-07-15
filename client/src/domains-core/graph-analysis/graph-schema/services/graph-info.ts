// import { getGraphLanguageType } from '@/services/antgraphconsole/DevelopmentDebuggingController';
// import { queryGraphManageDetail } from '@/services/antgraphconsole/GeaMakerGraphManageController';
// import { queryUpHtapOrder } from '@/services/antgraphconsole/GeaMakerOrderController';
// import { queryIntegrationSchema } from '@/services/antgraphconsole/SchemaOperationController';

// class GraphService {
//   public getGraphProjectDetail = queryGraphManageDetail;
//   public getGraphLanguageList = getGraphLanguageType;
//   public getGraphSchema = queryIntegrationSchema;
//   public getHtapOrderDetail = (
//     params: Parameters<typeof queryUpHtapOrder>[0],
//   ) => {
//     return queryUpHtapOrder(params).then((res) => {
//       const orderIntermediateArray: API.GeaMakerOrderStatusEnum[] = [
//         'WAIT_APPROVING',
//         'APPROVING',
//       ];
//       const result = res.data || {};

//       return {
//         ...res,
//         data: {
//           ...result,
//           isUpgradingHtap:
//             result?.geaMakerOrderVO?.status &&
//             orderIntermediateArray.includes(result?.geaMakerOrderVO?.status),
//           upgradeHtapError: result?.geaMakerOrderVO?.status === 'REJECT',
//         },
//       };
//     });
//   };
// }

// export default new GraphService();
