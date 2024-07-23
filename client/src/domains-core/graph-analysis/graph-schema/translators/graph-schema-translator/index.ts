import { AnalysisSchema, Schema } from '@/types/services';
import { propertiesTranslator } from '@/domains-core/graph-analysis/graph-schema/translators/properties-translator';
/* Graph analysis schema data conversion */
export const graphSchemaTranslator = (schema: Schema[]) => {
  const nodes: AnalysisSchema[] = [];
  const edges: AnalysisSchema[] = [];
  schema?.forEach(item => {
    if (item?.type === 'VERTEX') {
      nodes.push({
        ...item,
        nodeType: item?.label,
        properties: propertiesTranslator(item?.properties),
      });
    } else if (item?.type === 'EDGE') {
      edges.push({
        ...item,
        edgeType: item?.label,
        properties: propertiesTranslator(item?.properties),
      });
    }
  });

  return {
    nodes,
    edges,
  };
};
