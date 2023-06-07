import { ISchemaProperties } from '../service/tugraph/interface';
import { IVertextSchemaParams, IEdgeSchemaParams, ISchemaParams } from './interface';
/**
 * 转换使用 Cypher 查询节点 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatVertexSchemaResponse = (params: IVertextSchemaParams) => {
	const { label, properties } = JSON.parse(params[0][0]);

	const propertiesObj = {} as any;
	for (const p of properties) {
		propertiesObj[p.name] = p.type === 'STRING' ? 'string' : 'number';
	}

	return {
		nodeType: label,
		label,
		properties: propertiesObj,
	}
};

/**
 * 转换使用 Cypher 查询边 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatEdgeSchemaResponse = (params: IEdgeSchemaParams) => {
	const { constraints, label, properties } = JSON.parse(params[0][0]);
	if (constraints.length === 0) {
		// 忽略这条信息
		return null;
	}
	const [ source, target ] = constraints[0];

	const propertiesObj = {} as any;
	for (const p of properties) {
		propertiesObj[p.name] = p.type === 'STRING' ? 'string' : 'number';
	}

	return {
		sourceNodeType: source,
		targetNodeType: target,
		edgeType: label,
		label,
		properties: propertiesObj,
	}
};

/**
 * 转换使用 Cypher 查询子图 Schema 返回的数据格式
 * @param params
 * @return
 */
export const formatSchemaResponse = (params: ISchemaParams) => {
  return params;
};

/**
 * 原始属性与当前 diff，确定当前操作时新增、修改或删除
 * @param pre Schema 原始的 properties
 * @param cur Schema 当前的 properties 
 * @returns 
 */
export const diffProperties = (pre: ISchemaProperties[], cur: ISchemaProperties[]): {
	operationType: 'add' | 'update' | 'delete';
	properties: ISchemaProperties[]
} => {
  /**
	 * 如果是新增，则返回
	 * {
	 * 	operationType: 'add' | 'update' | 'delete',
	 * 	properties: ISchemaProperties[]
	 * }
	 */
	console.log(pre, cur)
	return {
		operationType: 'add',
		properties: []
	}
}