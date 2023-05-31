type CreateNode = {
  graphName: string;
  labelName: string;
  properties: Record<string, string | number | boolean>;
};

type CreateEdge = {
  graphName: string;
  sourceLabel: string;
  targetLabel: string;
  sourcePrimaryKey: string;
  sourceValue: string;
  targetPrimaryKey: string;
  targetValue: string;
  labelName: string;
  properties: Record<string, string | number | boolean>;
};

type EditNode = {
  graphName: string;
  primaryKey: string;
  primaryValue: string;
  labelName: string;
  properties: Record<string, string | number | boolean>;
};

type EditEdge = {
  graphName?: string;
  sourceLabel?: string;
  targetLabel?: string;
  sourcePrimaryKey?: string;
  sourceValue?: string;
  targetPrimaryKey?: string;
  targetValue?: string;
  labelName?: string;
  properties?: Record<string, string | number | boolean>;
};
type DeleteNode = {
  labelName: string;
  graphName: string;
  primaryKey: string;
  primaryValue: string;
};
type DeleteEdge = {
  graphName: string;
  sourceLabel: string;
  targetLabel: string;
  sourcePrimaryKey: string;
  sourceValue: string;
  targetPrimaryKey: string;
  targetValue: string;
  labelName: string;
};
