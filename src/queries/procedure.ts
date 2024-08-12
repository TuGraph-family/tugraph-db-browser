/**
 * file: procedure SQL command
 * author: Allen
*/

import {
  IProcedureListParams,
  IProcedureBuildParams,
  IProcedureCodeParams,
  IProcedureDeleteParams,
  IProcedureExecuteParams,
  IProcedureDemoParams
} from '@/types/studio/procedure';

/** build procedure */
const buildProcedureSQL = (params: IProcedureBuildParams) => {
  const {
    procedureName,
    procedureType,
    codeType,
    description,
    version,
    readonly
  } = params;

  return `CALL db.plugin.loadPlugin('${procedureType}', '${procedureName}', $data, '${codeType}', '${description}', ${readonly}, '${version}')`;
};

/** get procedure list*/
const getProcedureListSQL = (params: IProcedureListParams) => {
  const { procedureType } = params;
  /** any指代的是返回CPP或者PY所有类型的信息 */
  const codeType = 'any';
  return `CALL db.plugin.listPlugin('${procedureType}', '${codeType}')`;
};

/** get procedure source code*/
const getProcedureCodeSQL = (params: IProcedureCodeParams) => {
  const { procedureType, procedureName } = params;
  return `CALL db.plugin.getPluginInfo('${procedureType}', '${procedureName}', true)`;
};

/** delete procedure */
const deleteProcedureSQL = (params: IProcedureDeleteParams) => {
  const { procedureType, procedureName } = params;
  return `CALL db.plugin.deletePlugin('${procedureType}', '${procedureName}')`;
};

/** execute procedure */
const executeProcedureSQL = (params: IProcedureExecuteParams) => {
  const { procedureType, procedureName, timeout, inProcess } = params;
  return`CALL db.plugin.callPlugin('${procedureType}', '${procedureName}', $data, ${timeout.toFixed(2)}, ${inProcess})`;
};

/** get procedure demo */
const getProcedureDemoSQL = (params: IProcedureDemoParams) => {
  return ``;
}

export {
  buildProcedureSQL,
  getProcedureListSQL,
  getProcedureCodeSQL,
  deleteProcedureSQL,
  executeProcedureSQL,
  getProcedureDemoSQL
};
