import { ColumnsType } from 'antd/lib/table';
import { RcFile } from 'antd/lib/upload';

export interface CheckFileParams {
  fileName: string;
  flag: string;
  checkSum?: string; // 文件的md5值
  fileSize?: string;
}

export interface UploadFileParams {
  'File-Name': string;
  'Begin-Pos': string; //开始位置在文件内的偏移
  Size: string;
}

export interface SchemaProperty {
  name: string;
  type: string;
  optional?: boolean;
  unique?: boolean;
  index?: boolean;
}

export interface Schema {
  label: string;
  type: string;
  properties?: SchemaProperty[];
  primary?: string;
  constraints?: string[][];
}

export interface FileSchema {
  path: string;
  format: string;
  label: string;
  header: number;
  SRC_ID: string;
  DST_ID: string;
  columns: Array<string>;
}

export interface FileSchema {
  path: string;
  columns: string[];
  label: string;
  format: 'CSV' | 'JSON';
  header?: number;
  SRC_ID?: string;
  DST_ID?: string;
}

export interface ImportDataParams {
  graph: string;
  schema: {
    files: FileSchema[];
  };
  delimiter: string;
  continueOnError?: boolean;
  skipPackages?: string;
  taskId?: string;
  flag?: string;
}

export interface ImportSchemaParams {
  graph: string;
  schema: Schema[];
}

export interface LabelOption {
  value: string | number;
  label: string;
  children?: LabelOption[];
}

export interface FileData {
  fileName: string;
  formateSize: string;
  status: 'success' | 'error' | 'processing';
  file?: RcFile;
  fileSchema?: FileSchema;
  data?: {
    columns: ColumnsType<DataType>;
    dataSource: DataType[];
  } | null;
  labelOptions?: LabelOption[];
  selectedValue?: string[]
}

export type DataType = Record<string, string | number>;
