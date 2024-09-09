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

  return `MATCH p = (s)-[*1${newSep}]->(e) where id(s) = ${id} RETURN p`;
};

export const quickQueryCypher = (params: {
  limit?: number;
  rules?: {
    property: string;
    logic: string;
    value: string;
  };
  node: string;
  type: string;
}) => {
  const { limit, rules, node, type } = params;
  const { property, logic, value } = rules || {};
  let newValue = value;
  switch (type.toLowerCase()) {
    case 'string':
      newValue = `'${value}'`;
      break;
    case 'date':
      newValue = `DATE('${value}')`;
      break;
    case 'datetime':
      newValue = `DATETIME('${value}')`;
      break;
    default:
      break;
  }
  return `match(n:${node}) where n.${property} ${logic} ${newValue} return n limit ${limit}`;
};

export const pathQueryCypher = (params: {
  start: any;
  end: any;
  depth: number;
}) => {
  const { start, end, depth } = params;
  return `MATCH p = (a:${start.node} {name: '${start.property}'})-[*1..${depth}]->(d:${end.node} {name: '${end.property}'}) RETURN p`;
};
