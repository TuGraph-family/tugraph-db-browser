import { filter, flatMapDeep, includes, map } from 'lodash';
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
  }
) => {
  if (type === 'node') {
    return map(data?.nodes, (item) => ({
      id: item.labelName,
      label: item.labelName,
      type: 'graphin-circle',
      style: {
        label: { value: item.labelName },
      },
    }));
  }
  const edgeList = flatMapDeep(
    map(data?.edges, (item) => {
      return map(item.edgeConstraints, (constraint, index) => {
        return {
          id: index
            ? `edge_#${item.labelName + index}`
            : `edge_${item.labelName}`,
          source: constraint[0],
          target: constraint[1],
          label: item.labelName,
          style: {
            label: {
              value: item.labelName,
              fill: 'rgba(0,0,0,0.85)',
            },
            keyshape: {
              stroke: '#1650ff',
              lineWidth: 1,
            },
          },
          properties: item.properties,
        };
      });
    })
  );
  const nodeNameList = map(data?.nodes, (item) => item.labelName);
  const filterEdge = filter(
    edgeList,
    (item) =>
      includes(nodeNameList, item.source) && includes(nodeNameList, item.target)
  );
  return filterEdge;
};
