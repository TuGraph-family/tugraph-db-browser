import request from 'umi-request';
import { SERVER_HOST } from '../constant';
import { getLocalData } from '../utils/localStorage';
import { ImportDataParams, ImportSchemaParams } from '../interface/import';

/* Import Data */
export async function importData(params: ImportDataParams) {
  return request(`${SERVER_HOST}/import_data`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}

/* Import Shcema */
export async function importSchema(params: ImportSchemaParams) {
  return request(`${SERVER_HOST}/import_schema`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      ...params,
    },
  });
}

/* Import Progress */
export async function importProgress(taskId: string) {
  return request(`${SERVER_HOST}/import_progress`, {
    method: 'POST',
    headers: {
      Authorization: getLocalData('TUGRAPH_TOKEN'),
    },
    data: {
      taskId: taskId,
    },
  });
}
