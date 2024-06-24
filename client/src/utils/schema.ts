// @ts-nocheck

import {
    IVertextSchemaParams,
    IEdgeSchemaParams,
    RestFulResponse,
  } from '../services/interface';

  import { map, isEmpty } from 'lodash';
  /**
   * 转换使用 Cypher 查询节点 Schema 返回的数据格式
   * @param params
   * @return
   */
  export const formatVertexSchemaResponse = (params: IVertextSchemaParams) => {
    const { label, properties, primary } = params;
    const formatterProperties: any = [];
    const index: any = [];
  
    properties.forEach((item) => {
      formatterProperties.push({
        name: item.name,
        type: item.type,
        optional: item.optional,
      });
      if (item.index) {
        index.push({
          labelName: label,
          propertyName: item.name,
          isUnique: item.unique,
        });
      }
    });
  
    return {
      labelName: label,
      labelType: 'node',
      properties: formatterProperties,
      primaryField: primary,
      index,
    };
  };
  
  /**
   * 转换使用 Cypher 查询边 Schema 返回的数据格式
   * @param params
   * @return
   */
  export const formatEdgeSchemaResponse = (params: IEdgeSchemaParams) => {
    const { constraints, label, properties } = params;
    return {
      edgeConstraints: constraints,
      labelName: label,
      labelType: 'edge',
      properties,
    };
  };

  export const responseFormatter = (result: RestFulResponse) => {
    if (result?.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: null,
        errorCode: result.data.errorCode,
        errorMessage: result.data.errorMessage,
      };
    }
    const resultData =
      result?.data?.data?.result || result?.data?.data || result?.data || {};
    return {
      success: true,
      code: 200,
      data: resultData,
      errorCode: result?.data?.errorCode,
    };
  };

  export const QueryResultFormatter = (
    result: RestFulResponse,
    script: string,
  ) => {
    if (result.status !== 200 || result.data.errorCode != 200) {
      return {
        code: 200,
        errorCode: result.data.errorCode,
        errorMessage: result.data.errorMessage,
        success: false,
      };
    }
    const resultData = result.data.data.result;
    const responseData = formatMultipleResponse(resultData);
    const { edges, nodes } = responseData;
    return {
      data: {
        originalData: resultData,
        formatData:
          isEmpty(edges) && isEmpty(nodes)
            ? {
                nodes: [],
                edges: [],
              }
            : {
                edges,
                nodes,
              },
      },
      script,
      code: 200,
      success: true,
      errorCode: result.data.errorCode,
    };
  };


  