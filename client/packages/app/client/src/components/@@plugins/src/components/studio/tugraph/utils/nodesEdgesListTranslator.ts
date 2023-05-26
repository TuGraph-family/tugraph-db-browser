import { flatMapDeep } from 'lodash';
import { SchemaProperties } from '../interface/schema';

export const nodesEdgesListTranslator = (
  type: 'node' | 'edge',
  data: {
    nodes: Array<{
      indexs: string;
      labelName: string;
      nodeType: string;
      primary: string;
      properties: { id: string; name: string };
    }>;
    edges: Array<{
      labelType: string;
      indexs: string;
      labelName: string;
      edgeConstraints: Array<Array<string>>;
      properties: Array<SchemaProperties>;
    }>;
  },
) => {
  if (type === 'node') {
    return data?.nodes.map((item) => ({
      id: item.labelName,
      label: item.labelName,
      type: 'graphin-circle',
      style: { label: { value: item.labelName } },
    }));
  }
  const edgeList = flatMapDeep(
    data?.edges.map((item) => {
      return item.edgeConstraints.map((constraint, index) => {
        return {
          id: index ? `edge_#${item.labelName + index}` : `edge_${item.labelName}`,
          source: constraint[0],
          target: constraint[1],
          label: item.labelName,
          style: {
            label: {
              value: item.labelName,
              fill: 'rgba(0,0,0,0.85)',
            },
          },
          properties: item.properties,
        };
      });
    }),
  );
  const nodeNameList = data?.nodes.map((item) => item.labelName);
  const filterEdge = edgeList?.filter(
    (item) => nodeNameList.includes(item.source) && nodeNameList.includes(item.target),
  );
  return filterEdge;
};
