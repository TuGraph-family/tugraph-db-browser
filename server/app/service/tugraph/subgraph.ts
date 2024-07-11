// @ts-nocheck

/**
 * 子图相关，主要包括以下几部分内容：
 * 1. 创建子图
 * 2. 删除子图
 * 3. 修改子图
 * 4. 获取子图列表
 * 5. 查询子图信息
 * 6. 提取子图
 */

import { Service } from 'egg';
import { QueryResultFormatter, responseFormatter } from '../../util';
import { EngineServerURL } from './constant';
import { ISubGraphConfig, ISubGraphTemplateParams } from './interface';

class TuGraphSubGraphService extends Service {
  /**
   * 创建子图
   * @param graphName 子图名称
   * @param config 子图配置
   * @returns
   */
  async createSubGraph(graphName: string, config: ISubGraphConfig) {
    const { maxSizeGB, description } = config;
    const createCypher = `CALL dbms.graph.createGraph('${graphName}',  '${description}', ${maxSizeGB})`;

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: '',
        script: createCypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }

  /**
   * 从模版创建子图
   * @param graphName
   * @returns
   */
  async createSubGraphFromTemplate(params: ISubGraphTemplateParams) {
    const { graphName, config, description } = params;
    const { schema, files } = description;
    
    // 2. 创建schema
    const createSchemaResult =
      await this.ctx.service.tugraph.schema.importSchema({
        graph: graphName,
        schema,
        override: false,

      });

    if (!createSchemaResult.success) {
      return createSchemaResult;
    }

    // 3. 导入数据
    const importDataResult = await this.ctx.curl(
      `${EngineServerURL}/import_data`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: this.ctx.request.header.authorization,
        },
        method: 'POST',
        data: {
          graph: graphName,
          delimiter: ',', //数据分隔符
          continueOnError: true, //遇到错误时是否跳过错误数据并继续导入
          schema: { files },
        },
        timeout: [30000, 50000],
        dataType: 'json',
      },
    );

    if (
      importDataResult.data.errorCode != 200 ||
      importDataResult.status !== 200
    ) {
      return {
        success: false,
        code: importDataResult.status,
        data: null,
        errorCode: importDataResult.data.errorCode,
        errorMessage: importDataResult.data.errorMessage,
      };
    }
    const resultData = importDataResult.data.data;
    return {
      success: true,
      code: 200,
      data: resultData,
    };
  }

  /**
   * 更新子图信息
   * @param graphName 子图名称
   * @param config 子图配置
   * @returns
   */
  async updateSubGraph(graphName: string, config: ISubGraphConfig) {
    const { maxSizeGB, description } = config;
    const updateCypher = `CALL dbms.graph.modGraph('${graphName}',{description: '${description}',  max_size_GB: ${maxSizeGB}})`;

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: updateCypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }

  /**
   * 删除子图
   * @param graphName 子图名称
   * @returns
   */
  async deleteSubGraph(graphName: string) {
    const cypher = `CALL dbms.graph.deleteGraph('${graphName}')`;

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: '',
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }

  /**
   * 获取子图详情
   * @param graphName 子图名称
   * @returns
   */
  async getSubGraphInfo(graphName: string) {
    const cypher = `CALL dbms.graph.getGraphInfo('${graphName}')`;

    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return responseFormatter(result);
  }

  /**
   * 根据节点 ID 提取子图信息
   * @param graphName 子图名称
   * @param vertexIds 节点 ID 集合
   * @return
   */
  async querySubGraphByNodeIds(graphName: string, vertexIds: string[]) {
    const subGraphResult = await this.ctx
      .curl(`${EngineServerURL}/cypher`, {
        headers: {
          'content-type': 'application/json',
          Authorization: this.ctx.request.header.authorization,
        },
        method: 'POST',
        data: {
          graph: graphName,
          script: `call db.subgraph([${vertexIds}])`,
        },
        timeout: [30000, 50000],
        dataType: 'json',
      })
      .then(res => {
        const graphData = JSON.parse(res.data.result[0]);

        graphData.nodes.forEach(item => {
          item.vid = item.identity;
        });

        graphData.relationships.forEach(item => {
          item.source = item.src;
          item.destination = item.dst;
          item.uid = `${item.src}_${item.dst}_${item.label_id}_${item.temporal_id}_${item.identity}`;
        });
        return {
          status: res.status,
          data: graphData,
        };
      });

    if (subGraphResult.data.errorCode != 200 || subGraphResult.status !== 200) {
      return subGraphResult.data;
    }

    const { nodes, relationships } = subGraphResult.data;

    const graphData = {
      nodes: nodes.map(node => {
        const { vid, label, ...others } = node;
        return {
          ...others.properties,
          ...others,
          label,
          nodeType: label,
          id: `${vid}`,
        };
      }),
      edges: relationships.map(r => {
        const { uid, label, destination, source, ...others } = r;
        return {
          ...others.properties,
          ...others,
          id: `${uid}`,
          label,
          edgeType: label,
          target: `${destination}`,
          source: `${source}`,
        };
      }),
    };
    return {
      success: true,
      data: graphData,
    };
  }

  /**
   * 通过 Cypher 语句查询子图数据
   * @param graphName 图名称
   * @param cypher Cypher 查询语句
   */
  async querySubGraphByCypher(graphName: string, cypher: string) {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: cypher,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    return QueryResultFormatter(result as any, cypher);
  }

  /**
   * 查询子图列表
   */
  async getSubGraphList(userName) {
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: '',
        script: `CALL dbms.graph.listUserGraphs('${userName}')`,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }
}

export default TuGraphSubGraphService;
