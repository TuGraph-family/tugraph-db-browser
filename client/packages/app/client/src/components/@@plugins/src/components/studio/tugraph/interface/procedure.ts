export type UploadProcedureParams = {
  graphName: string;
  procedureType: string;
  procedureName: string;
  content: string;
  codeType: string;
  description: string;
  readOnly: string;
};
export type ProcedureParams = {
  graphName: string;
  procedureType: string;
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
};
