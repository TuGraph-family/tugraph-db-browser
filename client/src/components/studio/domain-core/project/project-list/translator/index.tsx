import { hasModuleAuth } from '../../../../components/auth-item';
import { bigNumberTransform } from '../../../../utils/bigNumberTransform';
import { compact } from 'lodash';
export const getProjectDetailTranslator = (res: any) => {
  if (res.success && res.data) {
    // browser code
    const param = window.location.search.slice(1) as any;
    const dataList = res.data?.list || [];
    const newList = dataList.map((item) => {
      if (item.id === param) {
        return { ...item, active: true };
      }
      return item;
    });
    return {
      ...res,
      data: {
        ...res.data,
        list: newList?.map((projectItem) => {
          const {
            offlineInstanceList,
            grayInstanceList,
            proInstanceList,
            menuAuthListVO,
          } = projectItem;
          const hasStatisticsAuth = hasModuleAuth(
            'geamaker.service.publish.home.graph.stats',
            menuAuthListVO?.menuAuths
          );
          const buttonIsDisabled =
            ((!offlineInstanceList ||
              offlineInstanceList.length < 1 ||
              offlineInstanceList[0].graphStatus !== 'BUILD_SUCCESS') &&
              (!grayInstanceList ||
                grayInstanceList.length < 1 ||
                grayInstanceList[0].graphStatus !== 'BUILD_SUCCESS') &&
              (!proInstanceList ||
                proInstanceList.length < 1 ||
                proInstanceList[0].graphStatus !== 'BUILD_SUCCESS')) ||
            !hasStatisticsAuth;
          const userNames = (projectItem.users || []).map(
            (item) => item.userName || item.loginName
          );
          const firstEnvKey = Object.keys(projectItem.nodeEdgeStats || {})[0];
          const firstEnvVal = Object.values(projectItem.nodeEdgeStats || {})[0];
          const nodeEdgeObjList = [
            {
              text: '类点',
              value: bigNumberTransform(Number(firstEnvVal?.nodeTypeNumber)),
            },
            {
              text: '点',
              value: bigNumberTransform(Number(firstEnvVal?.nodeNumber)),
            },
            {
              text: '类边',
              value: bigNumberTransform(
                Number(firstEnvVal?.inEdgeTypeNumber) +
                  Number(firstEnvVal?.outEdgeTypeNumber)
              ),
            },
            {
              text: '边',
              value: bigNumberTransform(
                Number(firstEnvVal?.inEdgeNumber) +
                  Number(firstEnvVal?.outEdgeNumber)
              ),
            },
          ];
          return {
            ...projectItem,
            memberNames: compact(userNames),
            isDisabledButton: buttonIsDisabled,
            hasStatisticsAuth: hasStatisticsAuth,
            nodeEdgeObjList: nodeEdgeObjList,
            isNodeEdgeObj:
              compact(nodeEdgeObjList.map((item) => item.value)).length > 0,
          };
        }),
      },
    };
  }
  return res;
};

export const allProjectListTranslator = (
  res: API.Result_List_BasicGeaMakerGraphProjectInfo__
) => {
  return {
    ...res,
    data: res?.data?.map((item) => {
      return {
        ...item,
        label: item.graphDisplayName,
        value: item.id,
      };
    }),
  };
};

export default allProjectListTranslator;
