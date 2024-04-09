/**
 * 数据查询，主要包括以下几部分内容：
 * 1. 查询节点
 * 2. 查询边
 * 3. 查询路径
 * 4. 查询点边属性
 * 5. 邻居查询
 */
import { Service } from 'egg';
import {
  IConfigQueryParams,
  ILanguageQueryParams,
  INeighborsParams,
  INodeQueryParams,
  IPathQueryParams,
} from './interface';

import { QueryResultFormatter, responseFormatter } from '../../util';
import {
  formatVertexResponse,
  generateCypherByConfig,
  generateCypherByNode,
  generateCypherByPath,
} from '../../utils/query';
import { EngineServerURL } from './constant';

class TuGraphQueryService extends Service {
  /**
   * 根据节点 ID 查询
   * @param graphName 子图名称
   * @param vertexId 节点 ID
   */
  async queryNodeById(graphName: string, vertexId: string) {
    const cypherLanguage = `MATCH (n) WHERE id(n)=${vertexId} RETURN n`;
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        // 从请求头中获取认证信息
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypherLanguage,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.data.errorCode != 200) {
      return result.data;
    }

    const nodes = formatVertexResponse(result.data);

    return {
      success: true,
      nodes,
    };
  }

  /**
   * 使用 Cypher 语句查询，按标准的 Cypher 返回结果转换，不做过多处理，即如果只查询点，不会去查询子图
   * @param params
   */
  async queryByGraphLanguage(params: ILanguageQueryParams) {
    const { graphName, script } = params;

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return QueryResultFormatter(result, script);
  }

  /**
   * 路径查询
   * @param params
   */
  async queryByPath(params: IPathQueryParams) {
    const { graphName } = params;
    const script = generateCypherByPath(params);
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return QueryResultFormatter(result, script);
  }

  /**
   * 节点查询
   * @param params
   */
  async queryByNode(params: INodeQueryParams) {
    const { graphName } = params;
    const script = generateCypherByNode(params);
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return QueryResultFormatter(result, script);
  }

  /**
   * 邻居查询
   * @param params
   */
  async queryNeighbors(params: INeighborsParams) {
    const { ids, graphName, sep = 1, limit = 200 } = params;
    let cypher = `match p=(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} RETURN p LIMIT ${limit}`;

    if (ids.length > 1) {
      // 查询两度关系，需要先查询节点，再查询子图
      cypher = `match p=(n)-[*..${sep}]-(m) WHERE id(n) in [${ids}] RETURN p LIMIT  ${limit}`;
    }

    const responseData =
      await this.ctx.service.tugraph.subgraph.querySubGraphByCypher(
        graphName,
        cypher,
      );
    return responseData;
  }

  /**
   * 根据配置查询数据
   * @param params IConfigQueryParams
   * @returns
   */
  async queryByConfig(params: IConfigQueryParams) {
    const { graphName } = params;
    const script = generateCypherByConfig(params);
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return QueryResultFormatter(result, script);
  }
  /**
   * 根据配置查询数据
   * @param params 查询存储过程列表
   * @returns
   */
  async queryListProcedures(params: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/list_procedures`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        ...params,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }
  /**
   * 根据配置查询数据
   * @param params 上传文件
   * @returns
   */
  async queryUploadProcedure(params: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/upload_procedure`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        ...params,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }
  /**
   * 根据配置查询数据
   * @param params 查询存储过程列表
   * @returns
   */
  async queryGetProcedures(params: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/get_procedure`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        ...params,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }
  /**
   * 根据配置查询数据
   * @param params 上传文件
   * @returns
   */
  async queryDeleteProcedure(params: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/delete_procedure`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        ...params,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }
  /**
   * 根据配置查询数据
   * @param params 查询存储过程列表
   * @returns
   */
  async queryCallProcedures(params: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/call_procedure`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        ...params,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }
  /**
   * 根据配置查询数据
   * @param params 上传文件
   * @returns
   */
  async queryGetProcedureDemo(params: any) {
    const result = await this.ctx.curl(
      `${EngineServerURL}/get_procedure_demo`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: this.ctx.request.header.authorization,
        },
        method: 'POST',
        data: {
          ...params,
        },
        timeout: [30000, 50000],
        dataType: 'json',
      },
    );

    return responseFormatter(result);
  }
}
export default TuGraphQueryService;
