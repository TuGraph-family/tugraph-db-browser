import { Driver } from 'neo4j-driver';
import { request } from './request';
import { responseFormatter } from '@/utils/schema';

export const importProgress = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request(driver, cypher);
  return responseFormatter(result);
};

export const importData = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request(driver, cypher);
  return responseFormatter(result);
};

export const checkFile = async (driver: Driver, params: any) => {
  const cypher = '';
  const result = await request(driver, cypher);
  return responseFormatter(result);
};

export const uploadFile = async (driver: Driver, params: any) => {
  //   const file = this.ctx.request.files[0];
  //   const buffer = fs.readFileSync(file.filepath);
  const cypher = '';
  const result = await request(driver, cypher);
  return responseFormatter(result);
};
