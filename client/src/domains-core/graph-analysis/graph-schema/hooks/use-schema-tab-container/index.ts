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
  return {
    tabContainerIndex,
    tabContainerField,
    setTabContainerValue,
  };
};
