import { OriginGraphData } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { mergeGraphData } from '@/domains-core/graph-analysis/graph-schema/utils/merge-graph-data';
import { useField, useForm } from '@formily/react';

export const useSchemaTabContainer = () => {
  const field = useField();
  const form = useForm();
  const tabContainerIndex = field.path.toArr()?.[1];
  const tabContainerField =
    form.fields[`CanvasList.${tabContainerIndex}.CanvasContainer`];
  const setTabContainerValue = (name: string, value: any) => {
    form.setValuesIn(`CanvasList.${tabContainerIndex}.${name}`, value);
  };
  const getTabContainerValue = (name: string) => {
    return form.getValuesIn(`CanvasList.${tabContainerIndex}.${name}`);
  };
  const setTabContainerGraphData = (options: {
    data: OriginGraphData;
    ifClearGraphData?: boolean;
  }) => {

    const { data, ifClearGraphData = true } = options;

    const { graphData, originQueryData } = data;
    const originGraphData = getTabContainerValue('originGraphData');
    // 清空数据
    if (ifClearGraphData) {
      setTabContainerValue('originGraphData', { graphData, originQueryData });
    } else {
      const newData = mergeGraphData(originGraphData.graphData, graphData);
      setTabContainerValue('originGraphData', {
        graphData: newData,
        originQueryData,
      });
    }
  };
  return {
    tabContainerIndex,
    tabContainerField,
    setTabContainerValue,
    getTabContainerValue,
    setTabContainerGraphData,
  };
};
