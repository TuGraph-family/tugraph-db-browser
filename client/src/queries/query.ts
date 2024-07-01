import { INeighborsParams } from '@/services/interface';

/*  */
export const queryNeighborsCypher = (params: INeighborsParams) => {
  const { ids, sep = 1, limit = 200 } = params;
  return ids.length > 1
    ? `match p=(n)-[*..${sep}]-(m) WHERE id(n) in [${ids}] RETURN p LIMIT  ${limit}`
    : `match p=(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} RETURN p LIMIT ${limit}`;
};
