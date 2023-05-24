export interface IVertextParams {
  [key: string]: {
    identity: number;
    label: string;
    properties: any;
  };
}

export interface IVertexResponse {
  id: string;
  label: string;
  properties: any;
}

export interface IEdgeParams {
  [key: string]: {
    id?: string;
    dst: number;
    forward: boolean;
    identity: number;
    label: string;
    properties: any;
    label_id: number;
    src: number;
    temporal_id: number;
  };
}

export interface IEdgeResponse {
  id: string;
  source: string;
  target: string;
  label: string;
  direction: 'IN' | 'OUT' | 'ALL';
  properties: any;
}

export interface IPathParams {
  identity: number;
  label: string;
  properties: any;
  dst?: number;
  forward?: boolean;
  label_id?: number;
  src?: number;
  temporal_id?: number;
}

export interface ISubGraphParams {}

export interface IMultipleParams {}

export interface IPropertiesParams {
  [key: string]: string | number | boolean;
}

// schema 相关
export interface IVertextSchemaParams {
  label: string;
  primary: string;
  properties: any[];
  type: string;
}

export interface IEdgeSchemaParams {
  constraints: string[][];
  label: string;
  properties: IPropertiesParams[];
  type: string;
}

export interface SchemaProperty {
  name: string;
  type: string;
  optional?: boolean;
  unique?: boolean;
  index?: boolean;
}

export interface Schema {
  label: string;
  type: string;
  properties?: SchemaProperty[];
  primary?: string;
  constraints?: string[][];
}

export interface ISchemaParams {
  graph: string;
  schema: Schema[];
  override?: boolean;
}

export interface IEdgeDataParams {
  graphName: string;
  sourceLabel: string;
  targetLabel: string;
  sourcePrimaryKey: string;
  sourceValue: string;
  targetPrimaryKey: string;
  targetValue: string;
  labelName: string;
  properties?: Record<string, unknown>;
}

export interface INodeDataParams {
  graphName: string;
  primaryKey: string;
  primaryValue: string;
  properties?: Record<string, unknown>;
}
