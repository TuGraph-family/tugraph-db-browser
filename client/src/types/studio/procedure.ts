/**
 * file: procedure types
 * author: Allen
*/

/** procedure list */
interface IProcedureListParams {
  graphName: string;
  procedureType: 'CPP' | 'PY';
}

/** procedure upload */
interface IProcedureBuildParams {
  graphName: string;
  procedureName: string;
  procedureType: 'CPP' | 'PY';
  description: string;
  /** 上传文件需转换为base64字符表示 */
  content: string;
  codeType: string;
  readonly: string;
  version: 'v1' | 'v2';
}

/** procedure code */
interface IProcedureCodeParams {
  graphName: string;
  procedureType: string;
  procedureName: string;
}

/** delete procedure */
interface IProcedureDeleteParams {
  graphName: string;
  procedureType: string;
  procedureName: string;
}

/** execute procedure */
interface IProcedureExecuteParams {
  graphName: string;
  procedureType: string;
  procedureName: string;
  timeout: number;
  inProcess: boolean;
  param: string;
  version: 'v1' | 'v2';
}

/** procedure demo */
interface IProcedureDemoParams {
  type: string;
}

export {
  IProcedureListParams,
  IProcedureBuildParams,
  IProcedureCodeParams,
  IProcedureDeleteParams,
  IProcedureExecuteParams,
  IProcedureDemoParams
};
