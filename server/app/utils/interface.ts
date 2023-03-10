export interface IVertextParams {
  [key: string]: {
    identity: number;
    label: string;
    properties: any;
  }
}

export interface IVertexResponse {
  id: string;
  label: string;
  properties: any;
}

export interface IEdgeParams {
  [key: string]: {
    dst: number;
    forward: boolean;
    identity: number;
    label: string;
    properties: any;
    label_id: number;
    src: number;
    temporal_id: number;
  }
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
  [key: string]: {
    identity: number;
    label: string;
    properties: any;
    dst?: number;
    forward?: boolean;
    label_id?: number;
    src?: number;
    temporal_id?: number;
  }[]
}

export interface ISubGraphParams {

}

export interface IMultipleParams {

}

export interface IPropertiesParams {

}

// schema 相关
export interface IVertextSchemaParams {

}

export interface IEdgeSchemaParams {

}

export interface ISchemaParams {

}
