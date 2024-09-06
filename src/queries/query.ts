import { INeighborsParams, INodeQuery } from '@/types/services';

/*  */
export const queryNeighborsCypher = (params: INeighborsParams) => {
  const { ids, sep = 1, limit = 200 } = params;
  return ids.length > 1
    ? `match p=(n)-[*..${sep}]-(m) WHERE id(n) in [${ids}] RETURN p LIMIT  ${limit}`
    : `match p=(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} RETURN p LIMIT ${limit}`;
};

export const getCypherByNode = (nodeQuery: INodeQuery) => {
  const { limit, logic, node, propertie, value, type = '' } = nodeQuery || {};
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

  return `match(n:${node}) where n.${propertie} ${logic} ${newValue} return n limit ${limit}`;
};
