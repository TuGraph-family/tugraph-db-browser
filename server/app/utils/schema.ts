import {
  IVertextSchemaParams,
  IEdgeSchemaParams,
} from '../service/tugraph/interface';
/**
 * 转换使用 Cypher 查询节点 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatVertexSchemaResponse = (params: IVertextSchemaParams) => {
  const { label, properties, primary } = params;
  const formatterProperties: any = [];
  const index: any = [];

  properties.forEach((item) => {
    formatterProperties.push({
      name: item.name,
      type: item.type,
      optional: item.optional,
    });
    if (item.index) {
      index.push({
        labelName: label,
        propertyName: item.name,
        isUnique: item.unique,
      });
    }
  });

  return {
    labelName: label,
    labelType: 'node',
    properties: formatterProperties,
    primaryField: primary,
    index,
  };
};

/**
 * 转换使用 Cypher 查询边 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatEdgeSchemaResponse = (params: IEdgeSchemaParams) => {
  const { constraints, label, properties } = params;
  return {
    edgeConstraints: constraints,
    labelName: label,
    labelType: 'edge',
    properties,
  };
};
