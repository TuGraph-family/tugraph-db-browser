import { map, find } from 'lodash';
import { Schema, SchemaProperty } from '../interface/import';
import { GraphData, NodeIndexProp, SchemaProperties } from '../interface/schema';

export const indexMergeToProperties = (index: NodeIndexProp[], properties: SchemaProperties[]): SchemaProperty[] => {
  return map(properties, (property) => {
    const { name, type, optional } = property;
    const indexMatch = find(index, (indexProp) => indexProp.propertyName === name);
    if (indexMatch) {
      return {
        name,
        type,
        optional,
        unique: indexMatch.isUnique,
        index: true,
      };
    }
    return {
      name,
      type,
      optional,
    };
  });
};

export const schemaTransform = (schema: GraphData): Schema[] => {
  const { nodes, edges } = schema;
  // 针对节点数据的转换
  const nodeSchemas = map(nodes, (node) => {
    const { labelName, primaryField, properties, index } = node;

    return {
      label: labelName,
      type: 'VERTEX',
      properties: indexMergeToProperties(index, properties),
      primary: primaryField,
    };
  });

  // 针对边数据的转换
  const edgeSchemas = edges.map((edge) => {
    const { labelName, properties } = edge;
    return {
      label: labelName,
      type: 'EDGE',
      properties,
      constraints: edge.edgeConstraints,
    };
  });

  return [...nodeSchemas, ...edgeSchemas];
};
