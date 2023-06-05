import { CollasibleStep } from '../components/collapsable-steps';
import movie_data from './demo-json/movie.json';
import three_body_data from './demo-json/three_body.json';
import three_kingdoms_data from './demo-json/three_kingdoms.json';
import wandering_earth_data from './demo-json/wandering_earth.json';
export type PROJECT_TAB = 'MY_PROJECT' | 'ALL_PROJEXCT';
export const PUBLIC_PERFIX_CLASS = 'ant-tugraph';
export const PROXY_HOST = `http://${window.location.hostname}:7001`;
export const SERVER_HOST = `http://${window.location.hostname}:9090/LGraphHttpService/Query`;
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
export const TUGRAPH_DEOM_NAME = [
  'Movie',
  'ThreeKindoms',
  'TheTreeBody',
  'WanderringEarth',
];
export const TUGRAPH_DEOM = [
  {
    graph_demo_name: 'Movie（电影）',
    graph_name: 'Movie',
    description: '基于电影、演员、用户场景的简单示例。',
    data: movie_data,
    imgUrl:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*vLs3RIMgT4UAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    graph_demo_name: 'Three Kindoms（三国）',
    graph_name: 'ThreeKindoms',
    description: '基于三国时期的历史事件的示例。',
    data: three_kingdoms_data,
    imgUrl:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*ebTkRIJx4SwAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    graph_demo_name: 'The Tree Body（三体）',
    graph_name: 'TheTreeBody',
    description: '基于刘慈欣的小说《三体》的故事背景示例。',
    data: three_body_data,
    imgUrl:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*UT-FQZ19zooAAAAAAAAAAAAADgOBAQ/original',
  },
  {
    graph_demo_name: 'Wanderring Earth（流浪地球）',
    graph_name: 'WanderringEarth',
    description: '基于电影《流浪地球1》、《流浪地球2》的剧情设计的示例。',
    data: wandering_earth_data,
    imgUrl:
      'https://mdn.alipayobjects.com/huamei_qcdryc/afts/img/A*Yn1mSLYzQsgAAAAAAAAAAAAADgOBAQ/original',
  },
];
export const IQUIRE_LIST = [
  { label: '语句查询', key: 'statement' },
  { label: '路径查询', key: 'path' },
  { label: '点查询', key: 'node' },
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
export enum PROPERTY_TYPE {
  INT8 = 'number',
  INT6 = 'number',
  INT32 = 'number',
  INT64 = 'number',
  FLOAT = 'number',
  DOUBLE = 'number',
  STRING = 'string',
  DATE = 'string',
  DATETIME = 'string',
  BLOB = 'string',
  BOOL = 'boolean',
}
