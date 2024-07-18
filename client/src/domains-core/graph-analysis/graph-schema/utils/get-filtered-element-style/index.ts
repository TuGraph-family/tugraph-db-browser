import { GraphStyleSettingValue } from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
import { filterElementByPropertyValue } from '@/domains-core/graph-analysis/graph-schema/utils/filter-element-by-property-value';

export const getFilteredElementStyle = (options: {
  styles: GraphStyleSettingValue;
  elementData: any;
}) => {
  const { styles, elementData } = options;
  const styleList = styles.elementStyleList;
  const { label, properties } = elementData;
  const style = styleList.find((item) => {
    const { propertyFilters, elementType } = item;
    return (
      item[`${elementType}Type` as 'nodeType'] === label &&
      (propertyFilters
        ? propertyFilters.every((filter) =>
            filterElementByPropertyValue(properties, filter),
          )
        : true)
    );
  });
  return style;
};
