import { Service } from 'egg';
import { responseFormatter } from '../../util';
import { EngineServerURL } from './constant';
import { log } from 'console';

class TuGraphAlgorithmService extends Service {
  async createAlgorithm(data: any) {
    log(this.ctx.request.header, 'header');
    const result = await this.ctx.curl(
      `${EngineServerURL}/create_procedure_job`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: this.ctx.request.header.authorization,
        },
        method: 'POST',
        data,
        timeout: [30000, 50000],
        dataType: 'json',
      },
    );
    return responseFormatter(result);
  }
  async getAlgorithm(data: any) {
    const result = await this.ctx.curl(
      `${EngineServerURL}/list_procedure_jobs`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: this.ctx.request.header.authorization,
        },
        method: 'POST',
        data,
        timeout: [30000, 50000],
        dataType: 'json',
      },
    );
    return responseFormatter(result);
  }
  async getAlgorithmResult(data: any) {
    const result = await this.ctx.curl(
      `${EngineServerURL}/get_procedure_job_result`,
      {
        headers: {
          'content-type': 'application/json',
          Authorization: this.ctx.request.header.authorization,
        },
        method: 'POST',
        data,
        timeout: [30000, 50000],
        dataType: 'json',
      },
    );
    return responseFormatter(result);
  }
  async uploadAlgorithm(data: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/upload_procedure`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data,
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }
  async deleteAlgorithm(data: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/delete_procedure`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data,
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }
  async callAlgorithm(data: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/call_procedure`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data,
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }
  async listProceduresAlgorithm(data: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/list_procedures`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data,
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }
  async getProceduresAlgorithm(data: any) {
    const result = await this.ctx.curl(`${EngineServerURL}/get_procedure`, {
      headers: {
        'content-type': 'application/json',
        Authorization: this.ctx.request.header.authorization,
      },
      method: 'POST',
      data,
      timeout: [30000, 50000],
      dataType: 'json',
    });
    return responseFormatter(result);
  }
}

export default TuGraphAlgorithmService;
