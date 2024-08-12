// import { find } from '@alipay/bigfish/utils/lodash';

// export const envGraphLanguageTranslator = (
//   data: Array<API.GraphLanguageTypeAndEnvVO>,
//   env: API.GraphDeployEnvEnum,
// ) => {
//   const resList = find(
//     data,
//     (item) => item?.graphDeployEnvEnum === env,
//   )?.graphLanguageTypeEnums;
//   const graphLanguageList =
//     resList
//       ?.filter((item: string) => item !== 'GQL')
//       ?.map((item) => ({ label: item, value: item })) || [];
//   return graphLanguageList;
// };
