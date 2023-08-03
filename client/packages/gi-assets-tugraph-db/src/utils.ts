import { useContext, utils, GraphSchemaData, IGraphData } from '@antv/gi-sdk';
export type AssetsItem = {
  components?: any;
  elements?: any;
  layout?: any;
  [key: string]: any;
};

export function mergeAssets(assetsItems: AssetsItem[]) {
  return assetsItems.reduce((finalAssets, assets) => {
    if (!assets) {
      return finalAssets;
    }
    Object.keys(assets).forEach((assetType) => {
      const typeAssets = finalAssets[assetType] || (finalAssets[assetType] = {});
      Object.assign(typeAssets, assets[assetType]);
    });
    return finalAssets;
  }, {});
}

const transformData = (data: any[], fieldMapping: { [key: string]: { name: string } }) => {
  if (Object.keys(fieldMapping).length === 0) return data;

  return data.map((datum) => {
    const { data, ...others } = datum;
    const transformedData = {} as { [key: string]: any };
    for (const key in data) {
      const mapping = fieldMapping[key];
      if (mapping) {
        transformedData[mapping.name] = data[key];
      } else {
        transformedData[key] = data[key];
      }
    }
    return { data: transformedData, ...others };
  });
};

export const transformSchema = (schemaData: GraphSchemaData) => {
  const { meta = {}, edges = [], nodes = [] } = schemaData;
  // @ts-ignore
  const { nodeFieldMapping = {}, edgeFieldMapping = {} } = meta;

  const _transform = (item: any, mapping: Record<string, any>) => {
    const { properties = {}, ...rest } = item;
    return {
      ...rest,
      properties: Object.entries(mapping).reduce(
        (result, [key, value]) => {
          if (properties.hasOwnProperty(key)) {
            result[value.name] = properties[key];
            delete result[key];
          }
          return result;
        },
        { ...properties },
      ),
    };
  };

  const transformEdges = edges.map((edge) => _transform(edge, edgeFieldMapping));
  const transformNodes = nodes.map((node) => _transform(node, nodeFieldMapping));

  return {
    edges: transformEdges,
    nodes: transformNodes,
  };
};

export const transformBySchemaMeta = (
  data: IGraphData,
  schemaData: GraphSchemaData & { meta: { nodeFieldMapping: any; edgeFieldMapping: any } },
) => {

  if (!schemaData) {
    return data
  }
  const { nodeFieldMapping = {}, edgeFieldMapping = {} } = schemaData?.meta || {};
  const { nodes, edges, ...rest } = data;

  const _nodes = transformData(data.nodes, nodeFieldMapping);
  const _edges = transformData(data.edges, edgeFieldMapping);
  const schema = transformSchema(schemaData);
  return {
    nodes: _nodes,
    edges: _edges,
    graphSchema: schema,
    ...rest
  };
};
