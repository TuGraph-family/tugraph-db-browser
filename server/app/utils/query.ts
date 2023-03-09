
import { IVertextParams, IEdgeParams, IPathParams, IMultipleParams, IPropertiesParams, ISubGraphParams } from './interface'

/**
 * 转换使用 Cypher 查询节点返回的数据格式
 * @param params 
 * @returns 
 */
export const formatVertexResponse = (params: IVertextParams) => {
  return params
}

/**
 * 转换使用 Cypher 查询边返回的数据格式
 * @param params 
 * @returns 
 */
export const formatEdgeResponse = (params: IEdgeParams) => {
	return params
}

/**
 * 转换使用 Cypher 查询路径返回的数据格式
 * @param params 
 * @returns 
 */
export const formatPathResponse = (params: IPathParams) => {
	return params
}

/**
 * 转换使用 Cypher 查询节点、边、path等多元素时返回的数据格式
 * @param params 
 * @returns 
 */
export const formatMultipleResponse = (params: IMultipleParams) => {
	return params
}

/**
 * 转换使用 Cypher 查询属性返回的数据格式
 * @param params 
 * @returns 
 */
export const formatPropertiesResponse = (params: IPropertiesParams) => {
	return params
}

/**
 * 转换使用 Cypher 查询子图返回的数据格式
 * @param params 
 * @returns 
 */
export const formatSubGraphResponse =  (params: ISubGraphParams) => {
	return params
}