export type UploadProcedureParams = {
  graphName: string;
  procedureType: 'cpp' | 'python';
  procedureName: string;
  content: string;
  codeType: string;
  description: string;
  readonly: string;
  version: string;
};
export type ProcedureParams = {
  graphName: string;
  procedureType: 'cpp' | 'python' | 'any';
  version: string;
};
export type ProcedureItemParams = {
  name?: string;
  version?: 'v1' | 'v2';
  description?: string;
  read_only?: string;
  signature?: string;
  type: 'cpp' | 'python';
  code_type: string;
};
export type ProcedureCode = {
  graphName: string;
  procedureType: string;
  procedureName: string;
};
export type DeleteProcedure = {
  graphName: string;
  procedureType: string;
  procedureName: string;
};
export type CallProcedure = {
  graphName: string;
  procedureType: string;
  procedureName: string;
  timeout: number;
  inProcess: boolean;
  param: string;
  version: 'v1' | 'v2';
};
