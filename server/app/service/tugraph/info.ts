/**
 * 系统相关，主要包括数据库系统信息
 */

import { Service } from 'egg';
import { responseFormatter } from '../../util';
import { EngineServerURL } from './constant';

class TuGraphInfoService extends Service {
  async curlPost(path: string, params: any) {
    const result = await this.ctx.curl(`${path}/`, {
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
  async querySystemInfo() {
    const cypher = 'CALL dbms.system.info()';
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
  async importSchema(params: any) {
    return this.curlPost(`${EngineServerURL}/import_schema`, params);
  }
  async importProgress(params: any) {
    return this.curlPost(`${EngineServerURL}/import_progress`, params);
  }
  async importData(params: any) {
    return this.curlPost(`${EngineServerURL}/import_data`, params);
  }
  async checkFile(params: any) {
    return this.curlPost(`${EngineServerURL}/check_file`, params);
  }
  async uploadFile(params: any) {
    return this.curlPost(`${EngineServerURL}/upload_files`, params);
  }
  async queryDatabaseInfo() {
    const cypher = 'CALL dbms.config.list()';
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
}

export default TuGraphInfoService;
