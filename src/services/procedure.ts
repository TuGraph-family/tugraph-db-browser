/**
 * file: procedure SQL promise
 * author: Allen
*/

import { message } from 'antd';

// SQL查询
import {
  buildProcedureSQL,
  getProcedureListSQL,
  executeProcedureSQL,
  getProcedureCodeSQL,
  deleteProcedureSQL
} from '@/queries/procedure';

// type
import {
  IProcedureBuildParams,
  IProcedureListParams,
  IProcedureCodeParams,
  IProcedureDeleteParams,
  IProcedureExecuteParams,
} from '@/types/studio/procedure';
import { Driver } from 'neo4j-driver';

// api
import { request } from './request';

// utils
import { responseFormatter } from '@/utils/schema';


/** build new procedure */
const buildProcedure = async(driver: Driver, params: IProcedureBuildParams) => {
  const { graphName, content } = params;
  try {
    const result = await request({
      driver,
      graphName,
      cypher: buildProcedureSQL(params),
      parameters: {
        data: content
      }
    });
    if (!result?.success) {
      message.error(result?.errorMessage?.message)
    }
    return responseFormatter(result);
  }
  catch(err) {console.log('构建procedure失败：', err)}
};

/** get procedure list */
const getProcedureList = async(driver: Driver, params: IProcedureListParams) => {
  const { graphName } = params;
  
  try {
    const cList = await request({
      driver,
      graphName,
      cypher: getProcedureListSQL({...params})
    });
    const pyList = await request({
      driver,
      graphName,
      cypher: getProcedureListSQL({...params, procedureType: 'PY'})
    });
    const mergeList = [...cList?.data, ...pyList?.data];
    return mergeList;
    // return cList
  }
  catch(error) {
    console.log(error)
  }
};

const executeProcedure = async(driver: Driver, params: IProcedureExecuteParams) => {
  const { graphName, param } = params;
  const result = await request({
    driver,
    graphName,
    cypher: executeProcedureSQL(params),
    parameters: {
      data: param || {}
    }
  });
  return responseFormatter(result);
}

const getProcedureCode = async(driver: Driver, params: IProcedureCodeParams) => {
  const { graphName } = params;
  const result = await request({
    driver,
    graphName,
    cypher: getProcedureCodeSQL(params),
  });
  return responseFormatter(result);
};

const deleteProcedure = async(driver: Driver, params: IProcedureDeleteParams) => {
  const { graphName } = params;
  const result = await request({
    driver,
    graphName,
    cypher: deleteProcedureSQL(params),
  });
  return responseFormatter(result);
};

export {
  buildProcedure,
  getProcedureList,
  executeProcedure,
  getProcedureCode,
  deleteProcedure
};