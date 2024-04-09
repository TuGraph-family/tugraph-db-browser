import { isEmpty } from 'lodash';
import { ICypherResponse, RestFulResponse } from './service/tugraph/interface';
import { formatMultipleResponse } from './utils/query';

export const responseData = (ctx, resp) => {
  if (!resp) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      code: 200,
    };
  }
  ctx.status = parseInt(resp.code, 10);
  ctx.body = resp;
};

export const responseFormatter = (result: RestFulResponse) => {
  if (result?.status !== 200) {
    return {
      success: false,
      code: result.status,
      data: null,
      errorCode: result.data.errorCode,
      errorMessage: result.data.errorMessage,
    };
  }
  const resultData =
    result?.data?.data?.result || result?.data?.data || result?.data || {};
  return {
    success: true,
    code: 200,
    data: resultData,
    errorCode: result?.data?.errorCode,
  };
};

export const getNodeIdsByResponseBak = (
  params: ICypherResponse,
): { nodeIds: Array<number>; edgeIds: Array<string> } => {
  const nodeIds: Array<number> = [];
  const edgeIds: Array<string> = [];

  const { result } = params;

  result.forEach(item => {
    if (Array.isArray(item)) {
      item.forEach(item_c => {
        if (typeof item_c === 'string' && item_c.startsWith('E[')) {
          const eid: any = item_c.replace(
            /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
            (_$1: string, _$2: string, $3: string) => {
              return $3;
            },
          );
          if (eid) {
            edgeIds.push(eid);
            const n = eid.split('_');
            nodeIds.push(parseInt(n[0]), parseInt(n[1]));
          }
        } else if (typeof item_c === 'string' && item_c.startsWith('[V')) {
          if (item_c.includes('E[')) {
            const Ids = item_c.split(',');
            Ids.forEach(itemId => {
              if (itemId.startsWith('E[')) {
                const eid: any = itemId.replace(
                  /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
                  (_$1: string, _$2: string, $3: string) => {
                    return $3;
                  },
                );
                if (eid) {
                  edgeIds.push(eid);
                  const n = eid.split('_');
                  nodeIds.push(parseInt(n[0]), parseInt(n[1]));
                }
              }
            });
          } else {
            const vid = item_c.replace(
              /(\[V\[)([0-9]*)(\]\])/g,
              (_$1: string, _$2: string, $3: string) => {
                return $3;
              },
            );
            nodeIds.push(parseInt(vid));
          }
        } else if (typeof item_c === 'string' && item_c.startsWith('V[')) {
          const vid = item_c.replace(
            /(V\[)([0-9]*)(])/g,
            (_$1: string, _$2: string, $3: string) => {
              return $3;
            },
          );
          nodeIds.push(parseInt(vid));
        }
      });
    }
  });

  return {
    nodeIds: [...new Set(nodeIds)],
    edgeIds: [...new Set(edgeIds)],
  };
};

export const getNodeIdsByResponse = (
  params: any,
): { nodeIds: Array<number>; edgeIds: Array<string> } => {
  const nodeIds: Array<number> = [];
  const edgeIds: Array<string> = [];
  const result = params.data.result;
  const headers = params.data.header;
  const edgeIndexList: Array<number> = [];
  const pathIndexList: Array<number> = [];
  headers.forEach((item: any, index: number) => {
    if (item.type === 4) {
      pathIndexList.push(index);
    } else if (item.type === 2) {
      edgeIndexList.push(index);
    }
  });
  result.forEach(item => {
    pathIndexList.forEach(c => {
      if (item && item[c]) {
        const data = JSON.parse(item[c]);
        data.forEach((el: any, index: number) => {
          if (index % 2 === 1) {
            const eid = `${el.src}_${el.dst}_${el.label_id}_${el.temporal_id}_${el.identity}`;
            edgeIds.push(eid);
            nodeIds.push(parseInt(el.src), parseInt(el.dst));
          }
        });
      }
    });
    edgeIndexList.forEach(c => {
      if (item && item[c]) {
        const data = JSON.parse(item[c]);
        const eid = `${data.src}_${data.dst}_${data.label_id}_${data.temporal_id}_${data.identity}`;
        edgeIds.push(eid);
        nodeIds.push(parseInt(data.src), parseInt(data.dst));
      }
    });
  });

  return {
    nodeIds: [...new Set(nodeIds)],
    edgeIds: [...new Set(edgeIds)],
  };
};

export const QueryResultFormatter = (
  result: RestFulResponse,
  script: string,
) => {
  if (result.status !== 200 || result.data.errorCode != 200) {
    return {
      code: 200,
      errorCode: result.data.errorCode,
      errorMessage: result.data.errorMessage,
      success: false,
    };
  }
  const resultData = result.data.data.result;
  const responseData = formatMultipleResponse(resultData);
  const { edges, nodes } = responseData;
  return {
    data: {
      originalData: resultData,
      formatData:
        isEmpty(edges) && isEmpty(nodes)
          ? {
              nodes: [],
              edges: [],
            }
          : {
              edges,
              nodes,
            },
    },
    script,
    code: 200,
    success: true,
    errorCode: result.data.errorCode,
  };
};

export const GetEnvironmentVariables = (env: any): any => {
  const queryReg = /[?\"](\-\-[a-zA-Z0-9_]+)=([a-zA-Z0-9\.\/\:]+)/g;
  let match: any[] | null = null;
  const result = {};
  //   {
  //     "tugraph_db_host": "http://47.105.42.70:9090", 图数据库服务地址
  //     "server_port": "7001", Node服务端端口
  //     "client_port": "8000" 前端Umi服务端口
  // }
  while ((match = queryReg.exec(env?.npm_lifecycle_script))) {
    result[`${match[1]}`.replace('--', '')] = match[2];
  }
  return result;
};
