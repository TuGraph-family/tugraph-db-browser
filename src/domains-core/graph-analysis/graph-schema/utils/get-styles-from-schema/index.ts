import { iconLoader } from '@/components/icon-loader';
import { DEFAULT_NODE_STYLE } from '@/domains-core/graph-analysis/graph-schema/constants/graph-style';
import { NodeData } from '@antv/g6';

/** 获得schema中的点边样式 */
export const getStylesFromSchema = (schemaData?: API.VisualModelDataVO) => {
  const style: Record<string, NodeData['style']> = {};
  schemaData?.nodes?.forEach(node => {
    const { nodeType, color } = node;
    const activeColor = color || '#1890ff';
    let icon = node.icon || ({} as any);
    if (typeof icon === 'string') {
      try {
        icon = JSON.parse(icon.replace(/&quot;/g, '"'));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
    style[nodeType!] = {
      ...DEFAULT_NODE_STYLE,
      fill: activeColor,
      iconFontFamily: icon.fontFamily,
      iconText: iconLoader(icon.name),
    };
  });
  schemaData?.edges?.forEach(edge => {
    const { color, edgeType } = edge;
    const activeColor = color || '#1890ff';
    style[edgeType!] = {
      stroke: activeColor,
    };
  });
  return style;
};
