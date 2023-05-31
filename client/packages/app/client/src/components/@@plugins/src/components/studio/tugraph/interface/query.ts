export type Condition = {
  property: string;
  value: string;
  operator: string;
};
export type StatementParams = {
  graphName: string;
  script?: string;
};
export type NodeQueryParams = {
  graphName: string;
  nodes?: Array<string>;
  limit?: number;
  conditions?: Array<Condition>;
};
export type PathQueryParams = {
  graphName: string;
  limit?: number;
  conditions?: Array<Condition>;
  path: string;
};
export type Edgeproperties = {
  end_time: number;
  start_time: number;
};
export type FormatDataEdgeProp = {
  direction: string;
  id: string;
  label: string;
  properties: Array<Edgeproperties>;
  source: string;
  target: string;
};
export type Nodeproperties = {
  confirmed_at: string;
  id: string;
  is_confirmed: boolean;
  name: string;
};
export type FormatDataNodeProp = {
  id: string;
  label: string;
  properties: Array<Nodeproperties>;
};
export type FormatData = {
  formatData?: {
    nodes: Array<FormatDataNodeProp>;
    edges: Array<FormatDataEdgeProp>;
  };
};
export type ExcecuteResultProp = {
  data: {
    formatData?: FormatData;
    originalData?: any;
  };
  success?: boolean;
};
