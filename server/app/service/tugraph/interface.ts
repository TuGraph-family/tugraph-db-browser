export interface RestFulResponse {
  data: {
    data: any;
    success: number;
    errorCode?: number;
    errorMsg?: string;
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
  config: ISubGraphConfig;
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
