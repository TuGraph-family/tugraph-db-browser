// @ts-nocheck

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
  labelName: string;
  primaryKey: string;
  primaryValue: string;
  properties?: Record<string, unknown>;
}

export interface RestFulResponse {
  data: {
    data: any;
    success: number;
    errorCode?: number;
    errorMessage?: string;
  };
  status: number;
}

export interface IUserParams {
  username: string;
  password: string;
  curPassword?: string; // 当前密码，用于给当前用户修改密码
  description?: boolean;
  roles?: string[];
}

export interface IUserRespons {
  user_name: string;
  user_info: {
    description?: string;
    disabled: boolean;
    roles?: string[];
    permissions?: Record<string, string>;
  };
}

export interface IRoleParams {
  role: string;
  description?: string;
  permissions?: Record<string, string>;
}

export interface IRoleRespons {
  role_name: string;
  role_info: {
    disabled: boolean;
    description?: boolean;
    field_permissions?: Record<string, string>;
    permissions?: Record<string, string>;
  };
}

export interface ILanguageQueryParams {
  script: string;
  graphName: string;
}

export type RelationOperator = '=' | '<>' | '<' | '<=' | '>' | '>=';
export interface Condition {
  property: string;
  value: number | string | boolean;
  operator: RelationOperator;
}
export interface IPathQueryParams {
  graphName: string;
  path: string;
  conditions: Condition[];
  limit: number;
}

export interface INodeQueryParams {
  graphName: string;
  nodes: string[];
  conditions: Condition[];
  limit: number;
}

export interface INeighborsParams {
  ids: string[];
  sep: number;
  graphName: string;
  limit?: number;
}

export interface ISubGraphConfig {
  maxSizeGB?: number;
  async?: boolean;
  description?: string;
}
export interface ICreateSubGraphParams {
  graphName: string;
  config: ISubGraphConfig;
}

export interface FileSchema {
  path: string;
  columns: string[];
  label: string;
  format: 'CSV' | 'JSON';
  header?: number;
  SRC_ID?: string;
  DST_ID?: string;
}

export interface ISubGraphTemplateParams {
  graphName: string;
  config: ISubGraphConfig;
  description: {
    schema: Schema[];
    files: FileSchema[];
  };
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
  primaryField?: string;
  edgeConstraints?: any[];
  indexs?: IIndexParams[];
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
  propertyNames: string;
}

export interface IIndexParams {
  labelName: string;
  propertyName: string;
  isUnique?: boolean;
}

export interface ICypherResponse {
  elapsed?: number;
  header: {
    [key: string]: string | number;
  }[];
  result: any[];
  size: number;
}

export interface IConfigQueryParams {
  graphName: string;
  nodeType: string;
  conditions: Condition[];
  limit: number;
}
