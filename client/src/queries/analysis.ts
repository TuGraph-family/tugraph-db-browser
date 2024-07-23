export const queryNeighborsCypher = (params: { sep?: number; id?: string }) => {
  const { sep, id } = params;
  let newSep = '';
  switch (sep) {
    case 2:
      newSep = '..2';
      break;
    case 3:
      newSep = '..3';
      break;
    default:
      break;
  }

  return `MATCH p = (start)-[*1${newSep}]->(end) where id(start) = ${id} RETURN p`;
};

export const quickQueryCypher = (params: {
  limit?: number;
  rules?: {
    property: string;
    logic: string;
    value: string;
  };
  node: string;
}) => {
  const { limit, rules, node } = params;
  const { property, logic, value } = rules || {};
  return `match(n:${node}) where n.${property} ${logic} ${value} return n limit ${limit}`;
};

export const pathQueryCypher = (params: {
  start: any;
  end: any;
  depth: number;
}) => {
  const { start, end, depth } = params;
  return `MATCH p = (a:${start.node} {name: '${start.property}'})-[*1..${depth}]->(d:${end.node} {name: '${end.property}'}) RETURN p`;
};
