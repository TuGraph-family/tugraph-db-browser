export const PUBLIC_PERFIX_CLASS = 'ant-tugraph';
export enum PERSSIONS_ENUM {
  READ = 'READ',
  WRITE = 'WRITE',
  FULL = 'FULL',
  NONE = 'NONE',
}
export enum PERSSION_COlOR {
  READ = 'gold',
  WRITE = 'green',
  FULL = 'blue',
  NONE = '#D9D9D9',
}
export const PERSSIONS_ENUM_TEXT = [
  { label: '全部', value: PERSSIONS_ENUM.FULL },
  { label: '读', value: PERSSIONS_ENUM.READ },
  { label: '写', value: PERSSIONS_ENUM.WRITE },
  { label: '无', value: PERSSIONS_ENUM.NONE },
];

export const PROXY_HOST = 'http://127.0.0.1:7001';
