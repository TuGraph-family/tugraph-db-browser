import { GraphStyleSettingValue } from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
import { GraphSchema } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { getFilteredElementStyle } from '@/domains-core/graph-analysis/graph-schema/utils/get-filtered-element-style';

export const getLabelTextByStyleConfig = (options: {
  styles: GraphStyleSettingValue;
  elementData: any;
  graphSchema?: GraphSchema;
  elementType: 'node' | 'edge';
}) => {
  const { elementData, graphSchema, elementType } = options;
  const style = getFilteredElementStyle(options);
  const schema = graphSchema?.[`${elementType}s`].find(
    (item) => item[`${elementType}Type` as 'nodeType'] === elementData.label,
  );
  let labelList: string[] = [];

  if (style) {
    const { displayLabels, showProperty, showTypeAlias } = style;
    if (showProperty) {
      displayLabels?.forEach((key) => {
        if (key === 'ID') {
          labelList.push(elementData.id);
        } else {
          labelList.push(elementData.properties[key] || '-');
        }
      });
    }
    if (schema && schema.typeAlias && showTypeAlias) {
      labelList.push(schema.typeAlias);
    }

    return labelList.join('\n');
  } else {
    return '';
  }
};
