import { addIndex, deleteIndex } from "@/queries/schema";
import { request } from "../request";
import { responseFormatter } from "@/utils/schema";
import { Driver } from "neo4j-driver";
import { IIndexParams } from "@/types/services";


/**
 * 创建索引
 * @param graphName 图名称
 * @param params
 * @param isIndependentRequest 是否为独立请求
 * @returns
 */
export const createIndex = async (
    driver: Driver,
    graphName: string,
    params: IIndexParams,
    isIndependentRequest = false,
  ) => {
    const { labelName, propertyName, isUnique = true } = params;
    const cypher = addIndex(labelName, propertyName, isUnique);
  
    const result = await request({ driver, cypher, graphName });
  
    if (isIndependentRequest) {
      return responseFormatter(result);
    }
    return result.data;
  };

/* 创建索引 */
export const createIndexSchema = async (
    driver: Driver,
    params: {
      propertyName: string;
      labelName: string;
      graphName: string;
      isUnique: boolean;
    },
  ) => {
    const { graphName, ...last } = params;
    const result = await createIndex(driver, graphName, last, true);
    return result;
  };
  
  /**
   * 删除索引
   * @param graphName 子图名称
   * @param params
   * @returns
   */
  export const deleteIndexSchema = async (
    driver: Driver,
    params: {
      propertyName: string;
      labelName: string;
      graphName: string;
    },
  ) => {
    const { labelName, propertyName, graphName } = params;
  
    const cypher = deleteIndex(labelName, propertyName);
    const result = await request({ driver, cypher, graphName });
  
    return responseFormatter(result);
  };