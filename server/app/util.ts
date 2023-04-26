import { RestFulResponse } from './service/tugraph/interface';

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
  if (result.status !== 200) {
    return {
      success: false,
      code: result.status,
      data: null,
      errorCode: result.data.errorCode,
      errorMessage: result.data.errorMsg,
    };
  }
  const resultData = result.data.data?.result;
  return {
    success: true,
    code: 200,
    data: resultData,
  };
};

interface ICypherResponse {
  elapsed?: number;
  header: {
    [key: string]: string | number;
  }[];
  result: any[];
  size: number;
}

export const getNodeIdsByResponseBak = (
  params: ICypherResponse
): { nodeIds: Array<number>; edgeIds: Array<string> } => {
  const nodeIds: Array<number> = [];
  const edgeIds: Array<string> = [];

  const { result } = params;

  result.forEach((item) => {
    if (Array.isArray(item)) {
      item.forEach((item_c) => {
        if (typeof item_c === 'string' && item_c.startsWith('E[')) {
          const eid: any = item_c.replace(
            /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
            (_$1: string, _$2: string, $3: string) => {
              return $3;
            }
          );
          if (eid) {
            edgeIds.push(eid);
            const n = eid.split('_');
            nodeIds.push(parseInt(n[0]), parseInt(n[1]));
          }
        } else if (typeof item_c === 'string' && item_c.startsWith('[V')) {
          if (item_c.includes('E[')) {
            const Ids = item_c.split(',');
            Ids.forEach((itemId) => {
              if (itemId.startsWith('E[')) {
                const eid: any = itemId.replace(
                  /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
                  (_$1: string, _$2: string, $3: string) => {
                    return $3;
                  }
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
              }
            );
            nodeIds.push(parseInt(vid));
          }
        } else if (typeof item_c === 'string' && item_c.startsWith('V[')) {
          const vid = item_c.replace(
            /(V\[)([0-9]*)(])/g,
            (_$1: string, _$2: string, $3: string) => {
              return $3;
            }
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
  params: any
): { nodeIds: Array<number>; edgeIds: Array<string> } => {
  const nodeIds: Array<number> = [];
  const edgeIds: Array<string> = [];
  console.log('getNodeIdsByResponse', params.data);
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
  result.forEach((item) => {
    pathIndexList.forEach((c) => {
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
    edgeIndexList.forEach((c) => {
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
