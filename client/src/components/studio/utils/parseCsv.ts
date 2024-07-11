import type { ColumnsType } from 'antd/es/table';
import Papa from 'papaparse';
import { DataType } from '../interface/import';

export const tableDataTranslator = () => {};

export const parseCsv = (file: any, delimiter = ',') => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      complete: results => {
        resolve(results.data);
      },
      error: error => {
        reject(error);
      },
    });
  });
};
