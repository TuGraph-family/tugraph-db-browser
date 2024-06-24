
/* 创建节点 */
export const createNodeCypher = (labelName: string, keys: string) => {
  return `CREATE (n:${labelName} {${keys}})`;
};

/* 创建边 */
export const createEdgeCypher = (
  sourceLabel: string,
  targetLabel: string,
  sourcePrimaryKey: string,
  sourceValueString: any,
  targetPrimaryKey: string,
  targetValueString: any,
  labelName: string,
  propertyString: string,
) => {
  return `MATCH (n:${sourceLabel}), (m:${targetLabel}) WHERE n.${sourcePrimaryKey} = ${sourceValueString} AND m.${targetPrimaryKey} = ${targetValueString} CREATE (n)-[r:${labelName}${propertyString}]->(m)`;
};

/* 删除节点 */
export const deleteNodeCypher = (
  labelName: string,
  primaryKey: string,
  primaryValue: string,
) => {
  return `MATCH (n:${labelName}) WHERE n.${primaryKey} = ${primaryValue} DELETE n`;
};

/* 删除边 */
export const deleteEdgeCypher = (
  sourceLabel: string,
  sourcePrimaryKey: string,
  sourceValueString: any,
  labelName: string,
  targetLabel: string,
  targetPrimaryKey: string,
  targetValueString: any,
) => {
  return `MATCH (n:${sourceLabel} {${sourcePrimaryKey}: ${sourceValueString}})-[r:${labelName}]-(m:${targetLabel} {${targetPrimaryKey}: ${targetValueString}}) DELETE r`;
};

/* 编辑节点 */
export const updateNodeCypher = (
  labelName: string,
  primaryKey: string,
  primaryValue: any,
  propertiesString: string,
) => {
  return `MATCH (n:${labelName}) WHERE n.${primaryKey} = ${primaryValue} SET ${propertiesString}`;
};
