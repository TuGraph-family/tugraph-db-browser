import type { ColumnsType } from 'antd/es/table';
import Papa from 'papaparse';
import { DataType } from '../interface/import';

export const tableDataTranslator = () => {};

export const parseCsv = (file: any) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: false,
      complete: (results) => {
        resolve(results.data?.slice(0, 5)); // 只取前5条数据
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};
