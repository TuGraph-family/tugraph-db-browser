import { GraphStyleSettingValue } from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
import { getFilteredElementStyle } from '@/domains-core/graph-analysis/graph-schema/utils/get-filtered-element-style';
import { iconLoader } from '@/components/icon-loader';

export const getNodeIconByStyleConfig = (options: {
  styles: GraphStyleSettingValue;
  elementData: any;
}) => {
  const { styles, elementData } = options;
  const style = getFilteredElementStyle({ styles, elementData });
  if (style && style.nodeIcon) {
    return {
      iconFontFamily: style.nodeIcon.fontFamily,
      iconText: iconLoader(style.nodeIcon.name),
    };
  } else {
    return {
      iconFontFamily: elementData.style?.iconFontFamily,
      iconText: elementData.style?.iconText,
    };
  }
};
