export interface ILanguageQueryParams {
  value: string;
  graphName: string;
}

export interface INeighborsParams {
  ids: string[];
  sep: number;
  graphName: string;
}

export interface ISubGraphConfig {
  maxSizeGB?: number;
  async?: boolean;
  description?: string;
}
export interface ICreateSubGraphParams {
  graphName: string;
  config: ISubGraphConfig
}

export interface ISchemaProperties {
  name: string;
  type: string | number | boolean;
  optional?: boolean;
}

export interface ICreateSchemaParams {
  graphName: string;
  labelType: 'node' | 'edge';
  labelName: string;
  properties: ISchemaProperties[];
  primaryField: string;
  edgeConstraints: any[];
}

export interface IUpdateSchemaParams {
  graphName: string;
  labelType: 'node' | 'edge';
  labelName: string;
  properties: ISchemaProperties[];
}

export interface IDeleteSchemaParams {
  graphName: string;
  labelType: 'node' | 'edge';
  labelName: string;
  fieldNames: string[];
}

export interface IIndexParams {
  graphName: string;
  labelName: string;
  propertyName: string;
  isUnique?: boolean;
}