import { Graph } from '@antv/g6';
import { GraphStyleSettingValue } from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
import { GraphSchema } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import { getLabelTextByStyleConfig } from '@/domains-core/graph-analysis/graph-schema/utils/get-label-text-by-style-config';
import { getNodeIconByStyleConfig } from '@/domains-core/graph-analysis/graph-schema/utils/get-node-icon-by-style-config';
import {
  getElementFillByStyleConfig,
  getNodeSizeByStyleConfig,
} from '@/domains-core/graph-analysis/graph-schema/utils/get-node-size-by-style-config';

export const updateGraphStyleOptions = (options: {
  graph?: Graph;
  styles: GraphStyleSettingValue;
  graphSchema?: GraphSchema;
}) => {
  const { graph, styles, graphSchema } = options;
  if (!graph) {
    return;
  }
  const graphOptions = graph.getOptions();
  graph.setOptions({
    node: {
      ...graphOptions.node,
      style: {
        ...graphOptions.node?.style,
        labelText: (data: any) => {
          return getLabelTextByStyleConfig({
            styles,
            elementData: data,
            graphSchema,
            elementType: 'node',
          });
        },
        size: (data: any) => {
          return getNodeSizeByStyleConfig({
            styles,
            elementData: data,
          });
        },
        fill: (data: any) => {
          return getElementFillByStyleConfig({
            styles,
            elementData: data,
            elementType: 'node',
          });
        },
        iconText: (data: any) => {
          return getNodeIconByStyleConfig({
            styles,
            elementData: data,
          }).iconText;
        },
        iconFontFamily: (data: any) => {
          return getNodeIconByStyleConfig({
            styles,
            elementData: data,
          }).iconFontFamily;
        },
      },
    },
    edge: {
      ...graphOptions.edge,
      style: {
        ...graphOptions.edge?.style,
        labelText: (data: any) => {
          return getLabelTextByStyleConfig({
            styles,
            elementData: data,
            graphSchema,
            elementType: 'edge',
          });
        },
        stroke: (data: any) => {
          return getElementFillByStyleConfig({
            styles,
            elementData: data,
            elementType: 'edge',
          });
        },
      },
    },
  });
  graph.draw();
};
