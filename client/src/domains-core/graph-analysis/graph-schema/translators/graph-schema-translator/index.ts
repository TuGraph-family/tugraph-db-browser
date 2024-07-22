import { AnalysisSchema, Schema, SchemaProperty } from '@/types/services';
/* properties conversion  */
const propertiesTranslator = (properties: SchemaProperty[] | undefined) => {
  const newProperties = {};

  properties?.forEach(item => {
    newProperties[item.name] = {
      schemaType: item?.type,
    };
  });

  return newProperties;
};

/* Graph analysis schema data conversion */
export const graphSchemaTranslator = (schema: Schema[]) => {
  const nodes: AnalysisSchema[] = [];
  const edges: AnalysisSchema[] = [];
  schema?.map(item => {
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
