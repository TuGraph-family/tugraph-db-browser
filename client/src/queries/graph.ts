export const getGraphList = (params: { userName: string }) => {
  const { userName } = params;
  return `CALL dbms.graph.listUserGraphs('${userName}')`;
};
