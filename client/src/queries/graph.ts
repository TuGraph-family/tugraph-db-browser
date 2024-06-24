/* 查询子图列表 */
export const getGraphList = (params: { userName: string }) => {
  const { userName } = params;
  return `CALL dbms.graph.listUserGraphs('${userName}')`;
};

/* 创建子图 */
export const createGraph = (params: {
  graphName: string;
  config: { description?: string; maxSizeGB?: number };
}) => {
  const {
    config: { description, maxSizeGB },
    graphName,
  } = params;
  return `CALL dbms.graph.createGraph('${graphName}',  '${description}', ${maxSizeGB})`;
};

/* 编辑子图 */
export const editGraph = (params: {
  graphName: string;
  config: { description: string; maxSizeGB: number };
}) => {
  const {
    config: { description, maxSizeGB },
    graphName,
  } = params;
  return `CALL dbms.graph.modGraph('${graphName}',{description: '${description}',  max_size_GB: ${maxSizeGB}})`;
};

/* 删除子图 */
export const deleteGraph = (params: { graphName: string }) => {
  const { graphName } = params;
  return `CALL dbms.graph.deleteGraph('${graphName}')`;
};
