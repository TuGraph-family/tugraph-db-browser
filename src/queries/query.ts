import { INeighborsParams, INodeQuery } from "@/types/services";

/*  */
export const queryNeighborsCypher = (params: INeighborsParams) => {
  const { ids, sep = 1, limit = 200 } = params;
  return ids.length > 1
    ? `match p=(n)-[*..${sep}]-(m) WHERE id(n) in [${ids}] RETURN p LIMIT  ${limit}`
    : `match p=(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} RETURN p LIMIT ${limit}`;
};


export const getCypherByNode = (  nodeQuery: INodeQuery)=>{
  const {limit, logic, node,propertie,value  } = nodeQuery || {}
  
  return `match(n:${node}) where n.${propertie} ${logic} ${value} return n limit ${limit}`;
}
