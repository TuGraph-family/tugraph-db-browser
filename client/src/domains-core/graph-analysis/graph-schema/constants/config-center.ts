import {
  ConfigCenterComponentMap,
  ConfigCenterOption,
} from '@/domains-core/graph-analysis/graph-schema/interfaces';
import type { SegmentedLabeledOption } from 'antd/lib/segmented';

export const CONFIG_CENTER_CATEGORY_OPTIONS: SegmentedLabeledOption[] = [
  {
    label: '全局导航栏',
    value: 'Header',
  },
  {
    label: '画布工具栏',
    value: 'CanvasHeader',
  },
];

export const CONFIG_CENTER_HEADER_CATEGORY_OPTIONS: ConfigCenterOption[] = [
  {
    label: '全局导航栏',
    visiblePathNameList: ['Header'],
  },
  {
    label: '返回箭头',
    visiblePathNameList: ['Header.HeaderLeft.PageBackArrow'],
  },
  {
    label: '项目标题',
    visiblePathNameList: ['Header.HeaderLeft.PageTitle'],
  },
  {
    label: '环境切换',
    visiblePathNameList: ['Header.HeaderLeft.EnvSelect'],
  },
  {
    label: '页面布局',
    visiblePathNameList: ['Header.HeaderRight.PageLayout'],
  },
];

export const CONFIG_CENTER_CATEGORY_MAP: Record<
  string,
  ConfigCenterComponentMap
> = {
  Header: {
    normal: CONFIG_CENTER_HEADER_CATEGORY_OPTIONS,
  },
  CanvasHeader: {
    normal: [
      {
        label: '画布工具栏',
        visiblePathNameList: ['CanvasList.*.CanvasContainer.CanvasHeader'],
      },
      {
        label: '视图切换',
        visiblePathNameList: [
          'CanvasList.*.CanvasContainer.CanvasHeader.ViewSelect',
        ],
      },
      {
        label: '查询过滤',
        visiblePathNameList: [
          'CanvasList.*.CanvasContainer.CanvasHeader.QueryFilterSegmented',
        ],
        props: {
          pathName:
            'CanvasList.*.CanvasContainer.CanvasHeader.QueryFilterSegmented',
          propsSchema: {
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 10,
                  layout: 'vertical',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-component-props': {
                      minColumns: [2],
                    },
                    properties: {
                      activeOptions: {
                        type: 'string',
                        'x-component': 'Select',
                        'x-decorator': 'FormItem',
                        title: '功能选项',
                        enum: [
                          {
                            label: '查询',
                            value: 'QUERY',
                          },
                          {
                            label: '筛选',
                            value: 'FILTER',
                          },
                        ],
                        'x-component-props': {
                          mode: 'multiple',
                        },
                        default: ['QUERY', 'FILTER'],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        label: '布局样式',
        visiblePathNameList: [
          'CanvasList.*.CanvasContainer.CanvasHeader.LayoutStyleSegmented',
        ],
        props: {
          pathName:
            'CanvasList.*.CanvasContainer.CanvasHeader.LayoutStyleSegmented',
          propsSchema: {
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 10,
                  layout: 'vertical',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-component-props': {
                      minColumns: [2],
                    },
                    properties: {
                      activeOptions: {
                        type: 'string',
                        'x-component': 'Select',
                        'x-decorator': 'FormItem',
                        title: '功能选项',
                        enum: [
                          {
                            label: '布局',
                            value: 'LAYOUT',
                          },
                          {
                            label: '样式',
                            value: 'STYLE',
                          },
                        ],
                        'x-component-props': {
                          mode: 'multiple',
                        },
                        default: ['LAYOUT', 'STYLE'],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        label: '画布操作',
        visiblePathNameList: [
          'CanvasList.*.CanvasContainer.CanvasHeader.CanvasToolbarSegmented',
        ],
        props: {
          pathName:
            'CanvasList.*.CanvasContainer.CanvasHeader.CanvasToolbarSegmented',
          propsSchema: {
            type: 'object',
            properties: {
              layout: {
                type: 'void',
                'x-component': 'FormLayout',
                'x-component-props': {
                  labelCol: 6,
                  wrapperCol: 10,
                  layout: 'vertical',
                },
                properties: {
                  grid: {
                    type: 'void',
                    'x-component': 'FormGrid',
                    'x-component-props': {
                      minColumns: [1],
                    },
                    properties: {
                      activeOptions: {
                        type: 'string',
                        'x-component': 'Select',
                        'x-decorator': 'FormItem',
                        title: '功能选项',
                        enum: [
                          {
                            label: '套索',
                            value: 'LASSO',
                          },
                        ],
                        'x-component-props': {
                          mode: 'multiple',
                        },
                        default: ['LASSO'],
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    ],
  },
};

export const CONFIG_CENTER_COMPONENT_TYPE_OPTIONS: Array<{
  label: string;
  value: keyof ConfigCenterComponentMap;
}> = [
  { label: '常用组件', value: 'normal' },
  { label: '更多组件', value: 'more' },
];
