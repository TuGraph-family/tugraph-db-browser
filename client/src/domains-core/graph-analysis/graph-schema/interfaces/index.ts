import { GraphData, LayoutOptions, NodeData } from '@antv/g6';
import type { DefaultOptionType } from 'antd/lib/select';

export interface PathQueryDataSource {
  index: number;
  graphData: GraphData;
  path: string;
  edgeIds: string[];
  contentHeight: number;
}

export type Operator = 'CT' | 'NC' | 'EQ' | 'NE' | 'GT' | 'LT' | 'GE' | 'LE';

export interface PropertyCondition {
  name: string;
  operator: Operator;
  value: string | number;
}

export interface TypePropertyCondition {
  type: string;
  conditions: PropertyCondition[];
}

export interface GraphSchema {
  nodes: Array<API.VisualNodeVO & { nodeType: string }>;
  edges: Array<API.VisualNodeVO & { edgeType: string }>;
}
export interface SchemaFormValue {
  graphSchemaStyle: Record<string, NodeData['style']>;
  graphSchema: GraphSchema;
  graphProjectInfo: API.GeaMakerProjectVO & {
    geaMakerGraphProjectType: API.GeaMakerGraphProjectTypeEnum;
  };
  htapOrderDetail: API.GeaMakerOrderDetailVO & {
    isUpgradingHtap: boolean;
    upgradeHtapError: boolean;
  };
  graphEngineType: API.SchemaEngineTypeEnum;
  graphLanguageList: DefaultOptionType[];
}

export interface StatisticsFilterConditionOption {
  value: string | boolean;
  label: string;
  rank?: number;
  isOutlier?: boolean;
}
export interface StatisticsFilterConditionHistogramValue {
  value: number;
}

export interface StatisticsFilterConditionHistogramOpt {
  /** 是否自定义分箱 */
  isCustom: boolean;
  min: number;
  max: number;
  binWidth: number;
}

export interface StatisticsFilterCondition {
  id: string;
  // 是否是智能推荐的
  isRecommend?: boolean;
  // 是否带有异常值，与智能推荐相关
  hasOutlier?: boolean;
  // 筛选属性值
  prop?: string;
  elementType?: 'node' | 'edge';
  range?: number[][];
  selectValue?: (string | boolean)[];
  selectOptions?: StatisticsFilterConditionOption[];
  analyzerType?:
    | 'HISTOGRAM'
    | 'SELECT'
    | 'PIE'
    | 'WORDCLOUD'
    | 'NONE'
    | 'DATE'
    | 'COLUMN';
  chartData?: Map<string | number, number>;
  // 直方图的数据是一维的，单独列出
  histogramData?: StatisticsFilterConditionHistogramValue[];
  isFilterReady?: boolean;
  /**  直方图的分箱配置 */
  histogramOptions?: StatisticsFilterConditionHistogramOpt;
  // 默认分析字段
  defaultKey?: string;
}

export interface LayoutConfigItem {
  id: string;
  src?: string;
  name?: string;
  options: LayoutOptions;
}

export type DefaultValue = string | boolean | number[] | number | null;

export interface LayoutFormItem {
  component: React.FC<any>;
  key: string;
  label: string;
  labelZh: string;
  description?: string;
  defaultValue?: DefaultValue;
  optionsData?: {
    label: string;
    value: string;
  }[];
  isSwitch?: boolean;
  icon?: any;
  [x: string]: any;
}
export interface LayoutFormConfig {
  title: string;
  type: string;
  items: LayoutFormItem[];
  icon?: any;
  thumbnail?: string;
  id: string;
}
