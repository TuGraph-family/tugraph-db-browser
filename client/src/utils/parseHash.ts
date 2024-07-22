/**
 * author: Allen
 * file: parse hash
*/

/** 解析 hash 路由的参数，附带graphName处理 */
const parseHashRouterParams = (url: string): { graphName: string, [key: string]: string } => {

    const [urlPart, hashPart] = url.split('#');
    const searchPart = hashPart ? hashPart.split('?')[1] : urlPart.split('?')[1];
  
    if (!searchPart) {
        return { graphName: '' };
    };
    
    const params: { [key: string]: string } = {};
    searchPart.split('&').forEach(param => {
      const [key, value] = param.split('=');
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    });
    
    return {
        ...params,
        graphName: params.graphName ?? ''
    };
  };

  export {
    parseHashRouterParams
  };
  