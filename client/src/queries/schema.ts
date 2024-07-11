/* 查询指定子图中节点的数量 */
export const getVertexLabels = () => {
  return `CALL db.vertexLabels() YIELD label RETURN count(label) AS vertexNumLabels`;
};

/* 查询指定子图中边的数量 */
export const getEdgeLabels = () => {
  return `CALL db.edgeLabels() YIELD label RETURN count(label) AS edgeNumLabels`;
};

/* 查图schema */
export const getGraphSchema = ()=>{
  return 'CALL dbms.graph.getGraphSchema()'
}

/* 查询数据库中点边数量 */
export const getCount = () => {
  return 'CALL dbms.meta.count()';
};

/* 获取所有边点类型 */
export const queryVertexLabels = () => {
  return 'CALL db.vertexLabels()';
};

/* 统计点 */
export const getVertexSchema = (labelName: string) => {
  return `CALL db.getVertexSchema('${labelName}')`;
};

/* 统计边 */
export const getEdgeSchema = (labelName: string) => {
  return `CALL db.getEdgeSchema('${labelName}')`;
};

/* 获取所有边类型 */
export const edgeLabels = () => {
  return 'CALL db.edgeLabels()';
};

/* 创建节点 */
export const createVertex = (
  labelName: string,
  primaryField: string,
  condition: string,
) => {
  return `CALL db.createLabel('vertex', '${labelName}', '${primaryField}', ${condition})`;
};

/* 创建边 */
export const createEdge = (
  labelName: string,
  edgeConstraints: string,
  condition: string,
) => {
  return condition
    ? `CALL db.createLabel('edge', '${labelName}', '${edgeConstraints}', ${condition})`
    : `CALL db.createLabel('edge', '${labelName}', '${edgeConstraints}')`;
};

/* 创建索引 */
export const addIndex = (
  labelName: string,
  propertyName: string,
  isUnique: boolean,
) => {
  return `CALL db.addIndex('${labelName}', '${propertyName}', ${isUnique})`;
};

/* 删除 schema */
export const deleteLabel = (type: string, labelName: string) => {
  return `CALL db.deleteLabel('${type}', '${labelName}')`;
};

/* 向指定label添加属性 */
export const alterLabelAddFields = (
  type: string,
  labelName: string,
  condition: string,
) => {
  return `CALL db.alterLabelAddFields('${type}', '${labelName}', ${condition})`;
};

/* 向指定label添加属性 */
export const alterLabelModFields = (
  type: string,
  labelName: string,
  condition: string,
) => {
  return `CALL db.alterLabelModFields('${type}', '${labelName}', ${condition})`;
};

/* 删除指定label添加属性 */
export const alterLabelDelFields = (
  type: string,
  labelName: string,
  propertyNames: string,
) => {
  return `CALL db.alterLabelDelFields('${type}', '${labelName}', ${propertyNames})`;
};


/* 删除原有的 schema */
export const dropDB = () => {
  return `CALL db.dropDB()`;
};


/* 删除索引 */
export const deleteIndex = (
  labelName: string,
  propertyName: string,
) => {
  return `CALL db.deleteIndex('${labelName}', '${propertyName}')`;
};


/* 创建点类型 */
export const createVertexLabelByJson=(
  json_data: string
)=>{
  return `CALL db.createVertexLabelByJson('${json_data}')`
}

/* 创建边类型 */
export const createEdgeLabelByJson=(
  json_data: string
)=>{
  return `CALL db.createEdgeLabelByJson('${json_data}')`
}

/* 批量upsert点数据 */
export const  upsertVertex = (node: string)=>{
  return  `CALL db.upsertVertex('${node}', $data)`
}

/* 批量upsert点数据 */
export const  upsertEdge = (edge: string)=>{
  return  `CALL db.upsertEdge('${edge}',$SRC, $DST, $data)`
}
