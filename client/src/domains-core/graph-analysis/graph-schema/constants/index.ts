import type { CheckboxOptionType } from 'antd';
import type { SegmentedLabeledOption } from 'antd/lib/segmented';

export const SPLITTER = '|PGSPLIPTER|';
export const CONFIG_CENTER_CATEGORY_OPTIONS: SegmentedLabeledOption[] = [
  {
    label: '全局导航栏',
    value: 'Header',
  },
  {
    label: '顶部工具栏',
    value: 'CanvasHeader',
  },
];

export const CONFIG_CENTER_COMMON_CATEGORY_OPTIONS: CheckboxOptionType[] = [
  {
    label: '环境切换',
    value: 'EnvSelect',
  },
];

export const CONFIG_CENTER_COMMON_CATEGORY_VALUES =
  CONFIG_CENTER_COMMON_CATEGORY_OPTIONS.map((item) => item.value);
