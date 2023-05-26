import { CollasibleStep } from '../components/collapsable-steps';
export type PROJECT_TAB = 'MY_PROJECT' | 'ALL_PROJEXCT';
export const PUBLIC_PERFIX_CLASS = 'ant-tugraph';
export const PROXY_HOST = 'http://127.0.0.1:7001';
export const SERVER_HOST = 'http://127.0.0.1:9091/LGraphHttpService/Query';
export const STEP_LIST: CollasibleStep[] = [
  {
    title: '新建一张图',
    description: '从这里开始创建一张图',
    iconType: 'icon-tuyanfashouye-xinjiantuxiangmu',
  },
  {
    title: '图构建',
    description: '完成图模型定义和数据导入',
    iconType: 'icon-tuyanfashouye-tugoujian',
  },
  {
    title: '图查询/分析',
    description: '图构建完成后可图查询和图分析',
    tooltipText: '请先完成图构建再进行进行图查询/分析',
    iconType: 'icon-tuyanfashouye-tufenxichaxun',
  },
];

export const GRAPH_OPERATE = [
  {
    lable: '添加点',
    icon: 'icon-tianjiadian',
    value: 'node',
  },
  {
    lable: '添加边',
    icon: 'icon-tianjiabian',
    value: 'edge',
  },
  {
    lable: '导入模型',
    icon: 'icon-daorumoxingwenjian',
    value: 'import',
  },
  {
    lable: '导出模型',
    icon: 'icon-daochumoxing',
    value: 'export',
  },
];
export enum EditType {
  SWITCH = 'SWITCH',
  INPUT = 'INPUT',
  RADIO = 'RADIO',
  CASCADER = 'CASCADER',
  SELECT = 'SELECT',
  JSON = 'JSON',
  SQL = 'SQL',
  DATE_PICKER = 'DATE_PICKER',
  CUSTOM = 'CUSTOM',
  NULL = 'NULL',
}
// 数据类型
export const DATA_TYPE = [
  { label: 'INT8', value: 'INT8' },
  { label: 'INT16', value: 'INT16' },
  { label: 'INT32', value: 'INT32' },
  { label: 'INT64', value: 'INT64' },
  { label: 'DOUBLE', value: 'DOUBLE' },
  { label: 'STRING', value: 'STRING' },
  { label: 'DATE', value: 'DATE' },
  { label: 'DATETIME', value: 'DATETIME' },
  { label: 'BLOB', value: 'BLOB' },
  { label: 'BOOL', value: 'BOOL' },
];
export const TUGRAPH_DEOM_NAME = ['default', 'CovidDemo1', 'MovieDemo1'];
export const TUGRAPH_DEOM = [
  { graph_name: 'default', description: '' },
  { graph_name: 'CovidDemo1', description: '' },
  { graph_name: 'MovieDemo1', description: '' },
];
export const IQUIRE_LIST = [
  { label: '语句查询', key: 'statement' },
  { label: '路径查询', key: 'path' },
  { label: '节点查询', key: 'node' },
];
export const CONNECT_STR_TYPE = ['STRING', 'DATE', 'DATETIME', 'BLOB', 'BOOL'];
export const CONNECT = {
  string: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '<>' },
  ],
  number: [
    { label: '等于', value: '=' },
    { label: '不等于', value: '<>' },
    { label: '大于', value: '>' },
    { label: '小于', value: '<' },
    { label: '大于等于', value: '>=' },
    { label: '小于等于', value: '<=' },
  ],
};
