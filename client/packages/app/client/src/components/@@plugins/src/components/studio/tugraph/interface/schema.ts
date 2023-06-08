export type LabelType = 'node' | 'edge';

export interface SchemaProperties {
  name: string;
  type: string;
  optional?: boolean;
  index?: false;
}

export interface IndexParams {
  labelName: string;
  propertyName: string;
  isUnique?: boolean;
  primaryField: boolean;
}

export interface LabelSchema {
  graphName: string;
  labelType: LabelType;
  labelName: string;
  properties: SchemaProperties[];
  primaryField: string;
  edgeConstraints: Array<any>;
  indexs: IndexParams[];
}

export interface StartData {
  id: string | number;
  source: string;
  target: string;
  disabled?: string;
}
export interface AttrData {
  id: string | number;
  name: string;
  type: string;
  optional: boolean;
  disabled?: boolean;
}
export interface IndexData {
  id: string | number;
  index: string;
  isUnique: boolean;
  primaryField: string;
  propertyName: string;
  disabled?: boolean;
}
export type NodeIndexProp = {
  isUnique: boolean;
  labelName: string;
  propertyName: string;
};
export type NodeProp = {
  index: Array<NodeIndexProp>;
  labelName: string;
  primaryField: string;
  labelType: 'node';
  properties: Array<SchemaProperties>;
};

export type EdgeProp = {
  edgeConstraints: string[][];
  labelName: string;
  labelType: 'edge';
  properties: Array<SchemaProperties>;
};

export interface GraphData {
  edges: EdgeProp[];
  nodes: NodeProp[];
}

export type GraphConfigData = {
  nodes: Array<{ id: string; label: string; type: string; style: any }>;
  edges: Array<{
    id?: string;
    label?: string;
    type?: string;
    style: any;
    source: string;
    target: string;
  }>;
};
