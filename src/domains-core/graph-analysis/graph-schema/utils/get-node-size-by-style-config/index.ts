import { GraphStyleSettingValue } from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
import {
  DEFAULT_EDGE_STYLE,
  DEFAULT_NODE_SIZE,
  DEFAULT_NODE_STYLE,
} from '@/domains-core/graph-analysis/graph-schema/constants/graph-style';
import { getFilteredElementStyle } from '@/domains-core/graph-analysis/graph-schema/utils/get-filtered-element-style';

export const getNodeSizeByStyleConfig = (options: {
  styles: GraphStyleSettingValue;
  elementData: any;
}) => {
  const { styles, elementData } = options;
  const style = getFilteredElementStyle({ styles, elementData });
  if (style) {
    return style.nodeSize;
  } else {
    return elementData.style?.size || DEFAULT_NODE_SIZE;
  }
};
export const getElementFillByStyleConfig = (options: {
  styles: GraphStyleSettingValue;
  elementData: any;
  elementType: 'node' | 'edge';
}) => {
  const { styles, elementData, elementType } = options;
  const style = getFilteredElementStyle({ styles, elementData });
  if (style) {
    return style[`${elementType}Color` as 'nodeColor'];
  } else {
    return (
      elementData.style?.fill ||
      (elementType === 'node'
        ? DEFAULT_NODE_STYLE.color
        : DEFAULT_EDGE_STYLE.color)
    );
  }
};
