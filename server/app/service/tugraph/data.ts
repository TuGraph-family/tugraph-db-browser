/**
 * 数据相关，主要包括以下几部分内容：
 * 1. 创建点/边数据
 * 2. 修改点/边数据
 * 3. 删除点/边数据
 */

import { Service } from 'egg';
import { map, join, isString } from 'lodash';
import { responseFormatter } from '../../util';
import { EngineServerURL } from './constant';
import { IEdgeDataParams, INodeDataParams } from './interface';
import {
  cypherValueFormatter,
  edgeMatchConditionFormatter,
} from '../../utils/data';

class TuGraphDataService extends Service {
  async createNode(
    graphName: string,
    labelName: string,
    properties: Record<string, unknown>
  ) {
    const keys = map(
      properties,
      (value: unknown, key: string) =>
        `${key}: ${!isString(value) ? value : "'" + value + "'"}`
    );
    const cypher = `CREATE (n:${labelName} {${join(keys, ', ')}})`;
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

  async createEdge(params: IEdgeDataParams) {
    const {
      graphName,
      sourceLabel,
      targetLabel,
      sourcePrimaryKey,
      sourceValue,
      targetPrimaryKey,
      targetValue,
      labelName,
      properties,
    } = params;
    const sourceValueString = cypherValueFormatter(sourceValue);
    const targetValueString = cypherValueFormatter(targetValue);

    const keys = map(
      properties,
      (value: string, key: string) =>
        `${key}: ${!isString(value) ? value : "'" + value + "'"}`
    );
    const propertyString = `{${join(keys, ', ')}}`;
    const cypher = `MATCH (n:${sourceLabel}), (m:${targetLabel}) WHERE n.${sourcePrimaryKey} = ${sourceValueString} AND m.${targetPrimaryKey} = ${targetValueString} CREATE (n)-[r:${labelName}${propertyString}]->(m)`;

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

  async deleteNode(params: INodeDataParams) {
    const { graphName, primaryKey, primaryValue, labelName } = params;
    const cypher = `MATCH (n:${labelName}) WHERE n.${primaryKey} = ${cypherValueFormatter(
      primaryValue
    )} DELETE n`;
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

  async deleteEdge(params: IEdgeDataParams) {
    const { graphName } = params;
    const cypher = `${edgeMatchConditionFormatter(params)} DELETE r`;
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

  async updateNode(params: INodeDataParams) {
    const { graphName, primaryKey, primaryValue, properties, labelName } =
      params;
    const propertiesString = map(
      properties,
      (value: unknown, key: string) =>
        `n.${key} = ${cypherValueFormatter(value)}`
    ).join(',');
    const cypher = `MATCH (n:${labelName}) WHERE n.${primaryKey} = ${cypherValueFormatter(
      primaryValue
    )} SET ${propertiesString}`;
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

  async updateEdge(params: IEdgeDataParams) {
    const { graphName, properties } = params;
    const propertiesString = map(
      properties,
      (value: unknown, key: string) =>
        `r.${key} = ${cypherValueFormatter(value)}`
    ).join(',');
    const cypher = `${edgeMatchConditionFormatter(
      params
    )} SET ${propertiesString}`;

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
}

export default TuGraphDataService;
