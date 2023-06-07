/**
 * Schema 相关，主要包括以下几部分内容：
 * 1. 创建 Schema
 * 2. 查询 Schema
 * 3. 点类型
 * 4. 边类型
 * 5. 修改 Schema
 */

import { Service } from 'egg';
import { diffProperties, formatEdgeSchemaResponse, formatVertexSchemaResponse } from '../../utils/schema';
import { EngineServerURL } from './constant';
import { ICreateSchemaParams, IDeleteSchemaParams, IIndexParams, IUpdateSchemaParams } from './interface';

class TuGraphSchemaService extends Service {
  /**
   * 创建 Schema
   * @param params 
   * @returns 
   */
  async createSchema(params: ICreateSchemaParams) {
    const { graphName, labelType, labelName, properties, primaryField, edgeConstraints = [] } = params

    let condition = ''
    properties.forEach((d, index) => {
      const { name, type, optional = false } = d
      if (index === properties.length - 1) {
        condition += `['${name}', ${type}, ${optional}]`
      } else {
        condition += `['${name}', ${type}, ${optional}],`
      }
    })
    
    let cypher = ``
    if (labelType === 'node') {
      cypher = `CALL db.createLabel('vertex', '${labelName}', ${primaryField}, ${condition})`;
   
    } else if (labelType === 'edge') {
      cypher = `CALL db.createLabel('edge', '${labelName}', ${edgeConstraints}, ${condition})`
    }

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
      timeout: [ 30000, 50000 ],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return result.data;
    }

    // 创建 Schema 后，如果有配置索引，还需要再创建索引
    // await this.createIndex(params)
    return result.data;
  }

  /**
   * 更新 Schema
   * @param params 
   */
  async updateSchema(params: IUpdateSchemaParams) {
    const { graphName, labelType, labelName, properties } = params
    /**
     * 要考虑到三种情况
     * 1. 指定 Label 中添加属性
     * 2. 修改已有属性值
     * 3. 删除属性
     */

    let labelSchemaInfo = await this.querySchemaByLabel(graphName, labelType, labelName)

    // diff properties & labelSchemaInfo.data.properties
    const { operationType, properties: dp } = diffProperties(labelSchemaInfo?.data.properties, properties)

    if (operationType === 'add') {
      this.addFieldToLabel({
        graphName,
        labelName,
        labelType,
        properties: dp
      })
    } else if (operationType === 'update') {
      this.updateFieldToLabel({
        graphName,
        labelName,
        labelType,
        properties: dp
      })
    } else if (operationType === 'delete') {
      this.deleteLabel({
        graphName,
        labelName,
        labelType,
        fieldNames: dp.map(d => d.name)
      })
      // 更新时候也要考虑到索引更新
      // this.deleteIndex(params)
    }
  }

  /**
   * 向指定的 label 中添加属性
   * @param params 
   * @returns 
   */
  async addFieldToLabel(params: IUpdateSchemaParams) {
    const { graphName, labelType, labelName, properties } = params

    let condition = ''
    properties.forEach((d, index) => {
      const { name, type, optional = false } = d
      if (index === properties.length - 1) {
        condition += `['${name}', ${type}, ${optional}]`
      } else {
        condition += `['${name}', ${type}, ${optional}],`
      }
    })

    const type = labelType === 'node' ? 'vertex' : 'edge'
    
    let cypher = `CALL db.alterLabelAddFields('${type}', '${labelName}', ${condition})`;

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

    if (result.status !== 200) {
      return result.data;
    }
    return result.data;
  }

  /**
   * 删除特定 label 或指定 Label 中的属性字段
   * @param params 
   * @returns 
   */
  async deleteLabel(params: IDeleteSchemaParams) {
    const { graphName, labelType, labelName, fieldNames } = params
    const type = labelType === 'node' ? 'vertex' : 'edge'

    let cypher = ''
    if (fieldNames) {
      // 只删除特定属性
      cypher = `CALL db.alterLabelDelFields('${type}', '${labelName}', ${fieldNames})`;
    } else {
      // 删除指定的 Label
      cypher = `CALL db.deleteLabel('${type}', '${labelName}')`
    }
    

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
      timeout: [ 30000, 50000 ],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return result.data;
    }
    return result.data;
  }

  /**
   * 修改 Label 中指定的属性字段
   * @param params 
   * @returns 
   */
  async updateFieldToLabel(params: IUpdateSchemaParams) {
    const { graphName, labelType, labelName, properties } = params

    let condition = ''
    properties.forEach((d, index) => {
      const { name, type, optional = false } = d
      if (index === properties.length - 1) {
        condition += `['${name}', ${type}, ${optional}]`
      } else {
        condition += `['${name}', ${type}, ${optional}],`
      }
    })

    const type = labelType === 'node' ? 'vertex' : 'edge'
    
    let cypher = `CALL db.alterLabelModFields('${type}', '${labelName}', ${condition})`;

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
      timeout: [ 30000, 50000 ],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return result.data;
    }
    return result.data;
  }

  /**
   * 根据类型和名称获取指定的 Schema 定义
   * @param graphName 子图名称
   * @param labelType 类型
   * @param labelName 名称
   * @returns 
   */
  async querySchemaByLabel(graphName: string, labelType: 'node' | 'edge', labelName: string) {
    let cypher = ''
    if (labelType === 'node') {
      cypher = `CALL db.getVertexSchema('${labelName}')`
    } else if (labelType === 'edge') {
      cypher = `CALL db.getEdgeSchema('${labelName}')`
    }

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

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    // 查询索引
    const indexs = await this.queryIndexByLabel(graphName, labelName)

    if (labelType === 'node') {
      const vertexResponseData = formatVertexSchemaResponse(result.data.result)

      return {
        success: false,
        code: result.status,
        data: {
          ...vertexResponseData,
          indexs
        },
      };
    } else if (labelType === 'edge') {
      const edgeResponseData = formatEdgeSchemaResponse(result.data.result)
  
      return {
        success: false,
        code: result.status,
        data: {
          ...edgeResponseData,
          indexs
        }
      };
    }
  }

  /**
   * 获取所有边类型 Schema 的信息
   * @param graphName 子图名称
   * @return
   */
  async queryEdgeSchema(graphName: string) {
    // step1: 先获取所有边类型
    const typeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: 'CALL db.edgeLabels()',
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    // step2: 根据获取到的边类型，再获取每个边类型的详细属性
    const edgeSchemaPromise = typeResult.data.map(async d => {
      const currentEdgeSchema = await this.querySchemaByLabel(graphName, 'edge', d);
      return currentEdgeSchema;
    });
    const edgeSchema = await Promise.all(edgeSchemaPromise);
    return edgeSchema;
  }

  async queryVertexSchema(graphName: string) {
    // step1: 先获取所有边类型
    const typeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: 'CALL db.vertexLabels()',
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    // step2: 根据获取到的边类型，再获取每个边类型的详细属性
    const vertexSchemaPromise = typeResult.data.map(async d => {
      const currentVertexSchema = await this.querySchemaByLabel(graphName, 'node', d);
      return currentVertexSchema;
    });
    const vertexSchema = await Promise.all(vertexSchemaPromise);
    return vertexSchema;
  }

  /**
   * 查询指定子图的 Schema
   * @param graphName 子图名称
   */
  async querySchema(graphName: string) {
    const vertexSchema = await this.queryVertexSchema(graphName);
    const edgeSchema = await this.queryEdgeSchema(graphName);
    return {
      nodes: vertexSchema,
      edges: edgeSchema,
    };
  }

  /**
   * 查询指定子图中节点和边的数量
   * @param graphName 子图名称
   * @param authorization 认证信息
   */
  async getVertexEdgeCount(graphName: string) {
    const nodeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: 'MATCH n RETURN count(n)',
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (nodeResult.status !== 200) {
      return {
        success: false,
        code: nodeResult.status,
        data: null,
      };
    }

    const { num_vertex, num_label } = nodeResult.data;

    // 查询 graph 中边的数量
    const edgeCypher = 'MATCH (n)-[e]->(m) RETURN count(e)';
    const result = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: edgeCypher,
      },
      timeout: [30000, 500000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    return {
      success: true,
      code: 200,
      data: {
        nodeCount: num_vertex,
        nodeLabelCount: num_label,
        edgeCount: result.data.result[0][0],
      },
    };
  }

  /**
   * 统计点类型和边类型的数量
   * @returns 
   */
  async statisticsSchemaCount(graphName: string) {
    const vertexCypher = `CALL db.vertexLabels() YIELD label RETURN count(label) AS vertexNumLabels`
    const edgeCypher = `CALL db.edgeLabels() YIELD edgeLabels RETURN count(edgeLabels) AS edgeNumLabels`

    const vertexResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: vertexCypher,
      },
      timeout: [ 30000, 50000 ],
      dataType: 'json',
    });

    if (vertexResult.status !== 200) {
      return vertexResult.data
    }
    console.log('点类型数量', vertexResult.data)

    const edgeResult = await this.ctx.curl(`${EngineServerURL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: edgeCypher,
      },
      timeout: [ 30000, 50000 ],
      dataType: 'json',
    });

    if (vertexResult.status !== 200) {
      return edgeResult.data
    }
    console.log('边类型数量', vertexResult.data)
  }

  /**
   * 创建索引
   * @param params 
   * @returns 
   */
  async createIndex(params: IIndexParams) {
    const { graphName, labelName, propertyName, isUnique } = params
    const cypher = `CALL db.addIndex(${labelName}, ${propertyName}, ${isUnique})`
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
      timeout: [ 30000, 50000 ],
      dataType: 'json',
    });

    return result.data
  }

  /**
   * 删除索引
   * @param params 
   * @returns 
   */
  async deleteIndex(params: IIndexParams) {
    const { graphName, labelName, propertyName } = params
    const cypher = `CALL db.deleteIndex(${labelName}, ${propertyName})`
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
      timeout: [ 30000, 50000 ],
      dataType: 'json',
    });

    return result.data
  }

  /**
   * 查询指定类型的索引列表
   * @param graphName 子图名称
   * @param labelName 类型名称
   * @returns 
   */
  async queryIndexByLabel(graphName: string, labelName: string) {
    const cypher = `CALL db.listLabelIndexes(${labelName})`
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
      timeout: [ 30000, 50000 ],
      dataType: 'json',
    });

    return result.data
  }
}

export default TuGraphSchemaService;
