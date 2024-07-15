import { ISchema } from '@formily/react';

export const GRAPH_SCHEMA: ISchema = {
  type: 'object',
  properties: {
    schemaVersion: {
      type: 'string',
      default: '1.0',
    },
    // 图构建schema样式
    graphSchemaStyle: {
      type: 'string',
    },
    // schema
    graphSchema: {
      type: 'string',
    },
    // 图引擎类型
    graphEngineType: {
      type: 'string',
    },
    // 支持的图查询语言
    graphLanguageList: {
      type: 'array',
    },
    // 图项目信息
    graphProjectInfo: {
      type: 'object',
    },
    htapOrderDetail: {
      type: 'object',
    },
    // 页面顶部
    Header: {
      type: 'object',
      'x-decorator': 'div',
      'x-decorator-props': {
        className: 'schema-header',
      },
      default: {},
      properties: {
        // 页面顶部左侧
        HeaderLeft: {
          type: 'object',
          'x-decorator': 'div',
          'x-decorator-props': {
            className: 'schema-header-left',
          },
          properties: {
            PageBackArrow: {
              type: 'void',
              'x-component': 'PageBackArrow',
            },
            PageTitle: {
              'x-component': 'PageTitle',
              default: '标题',
            },
            EnvSelect: {
              'x-component': 'EnvSelect',
            },
          },
        },
        // 页面顶部右侧
        HeaderRight: {
          type: 'object',
          'x-decorator': 'div',
          'x-decorator-props': {
            className: 'schema-header-right',
          },
          properties: {
            JumpToOld: {
              type: 'void',
              'x-component': 'JumpToOld',
            },
            ConfigCenter: {
              'x-component': 'ConfigCenter',
            },
            PageLayout: {
              'x-component': 'PageLayoutSegmented',
              default: 'Tab',
            },
          },
        },
      },
    },
    // 多画布区域
    CanvasList: {
      type: 'array',
      'x-component': 'ArrayTabs',
      'x-component-props': {
        defaultValue: { LeftSiderContent: 'QUERY' },
      },
      default: [
        {
          LeftSiderContent: 'QUERY',
        },
      ],
      'x-reactions': {
        dependencies: ['.Header.HeaderRight.PageLayout'],
        fulfill: {
          schema: {
            'x-component':
              '{{$deps[0] === "Card" ? "ArrayCollapse": "ArrayTabs"}}',
            title: '{{$deps[0] === "Card" ? undefined : "画布"}}',
          },
        },
      },
      properties: {
        addition: {
          type: 'void',
          title: '添加画布',
          'x-component': 'ArrayCards.Addition',
          'x-reactions': {
            dependencies: ['..Header.HeaderRight.PageLayout'],
            fulfill: {
              state: {
                visible: '{{$deps[0] === "Card"}}',
              },
            },
          },
          'x-component-props': {
            defaultValue: {
              LeftSiderContent: 'QUERY',
            },
            style: {
              marginBottom: 200,
            },
          },
        },
      },
      items: {
        type: 'object',
        'x-component': 'ArrayCollapse.CollapsePanel',
        'x-component-props': {
          header: '画布',
          forceRender: true,
        },
        'x-reactions': {
          dependencies: ['..Header.HeaderRight.PageLayout'],
          fulfill: {
            schema: {
              'x-component-props.className':
                '{{$deps[0] === "Card" ? "card-canvas-container": "tab-canvas-container"}}',
            },
          },
        },
        properties: {
          index: {
            type: 'void',
            'x-component': 'ArrayCollapse.Index',
            'x-reactions': {
              dependencies: ['...Header.HeaderRight.PageLayout'],
              fulfill: {
                state: {
                  visible: '{{$deps[0] === "Card"}}',
                },
              },
            },
          },
          remove: {
            type: 'void',
            'x-component': 'ArrayCollapse.Remove',
            'x-reactions': {
              dependencies: [
                '...Header.HeaderRight.PageLayout',
                '...CanvasList',
              ],
              fulfill: {
                state: {
                  visible:
                    '{{$deps[0] === "Card" && $deps[1].length -1 === $self.indexes[0]  &&   $self.indexes[0] !== 0}}',
                },
              },
            },
          },
          // 左侧边栏内容
          LeftSiderContent: {
            type: 'string',
          },
          // 右侧边栏内容
          RightSiderContent: {
            type: 'string',
          },
          // 画布容器
          CanvasContainer: {
            type: 'object',
            'x-component': 'CanvasContainer',
            'x-reactions': {
              dependencies: ['...Header.HeaderRight.PageLayout'],
              fulfill: {
                schema: {
                  'x-component-props.defaultResizableHeight':
                    '{{$deps[0] === "Card" ? "500" : "100%"}}',
                },
              },
            },
            properties: {
              // 画布顶部
              CanvasHeader: {
                type: 'object',
                'x-decorator': 'div',
                'x-decorator-props': {
                  className: 'canvas-header',
                },
                properties: {
                  ViewSelect: {
                    type: 'string',
                    'x-component': 'ViewSelect',
                    default: 'G6_2D_CANVAS',
                  },
                  Divider1: {
                    type: 'void',
                    'x-component': 'Divider',
                    'x-component-props': {
                      type: 'vertical',
                    },
                  },
                  QueryFilterTitle: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '查询过滤',
                      className: 'canvas-header-title',
                    },
                  },
                  QueryFilterSegmented: {
                    type: 'string',
                    'x-component': 'QueryFilterSegmented',
                    default: 'QUERY',
                  },
                  Divider2: {
                    type: 'void',
                    'x-component': 'Divider',
                    'x-component-props': {
                      type: 'vertical',
                    },
                  },
                  LayoutStyleTitle: {
                    type: 'void',
                    'x-component': 'div',
                    'x-component-props': {
                      children: '布局样式',
                      className: 'canvas-header-title',
                    },
                  },
                  LayoutStyleSegmented: {
                    type: 'string',
                    'x-component': 'LayoutStyleSegmented',
                    default: null,
                  },
                },
              },
              // 画布中间内容
              CanvasCenter: {
                type: 'void',
                'x-component': 'div',
                'x-component-props': {
                  className: 'canvas-center',
                },
                properties: {
                  // 画布左侧边栏
                  CanvasLeftSider: {
                    type: 'object',
                    'x-decorator': 'CanvasSider',
                    'x-decorator-props': {
                      enable: {
                        top: false,
                        right: true,
                        bottom: false,
                        left: false,
                        topRight: false,
                        bottomRight: false,
                        bottomLeft: false,
                        topLeft: false,
                      },
                    },
                    properties: {
                      QuerySegmented: {
                        type: 'string',
                        'x-component': 'QuerySegmented',
                        'x-reactions': {
                          dependencies: ['....LeftSiderContent'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "QUERY"}}',
                            },
                          },
                        },
                        default: 'CONFIG_QUERY',
                      },
                      FilterSegmented: {
                        type: 'string',
                        'x-component': 'FilterSegmented',
                        'x-reactions': {
                          dependencies: ['....LeftSiderContent'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "FILTER"}}',
                            },
                          },
                        },
                        default: 'ATTRIBUTES_FILTER',
                      },
                      LayoutForm: {
                        type: 'object',
                        'x-component': 'LayoutForm',
                        'x-reactions': {
                          dependencies: ['....LeftSiderContent'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0]?.includes("LAYOUT")}}',
                            },
                          },
                        },
                      },
                      GraphStyleSetting: {
                        type: 'object',
                        'x-component': 'GraphStyleSetting',
                        'x-reactions': {
                          dependencies: ['....LeftSiderContent'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "STYLE"}}',
                            },
                          },
                        },
                      },
                      LanguageQuery: {
                        type: 'object',
                        'x-component': 'LanguageQuery',
                        'x-reactions': {
                          dependencies: ['.QuerySegmented'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "LANGUAGE_QUERY"}}',
                            },
                          },
                        },
                      },
                      TemplateQuery: {
                        type: 'object',
                        'x-component': 'TemplateQuery',
                        'x-reactions': {
                          dependencies: ['.QuerySegmented'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "TEMPLATE_QUERY"}}',
                            },
                          },
                        },
                      },
                      ConfigQuery: {
                        type: 'object',
                        'x-component': 'ConfigQuery',
                        'x-reactions': {
                          dependencies: ['.QuerySegmented'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "CONFIG_QUERY"}}',
                            },
                          },
                        },
                      },
                      PathQuery: {
                        type: 'object',
                        'x-component': 'PathQuery',
                        'x-reactions': {
                          dependencies: ['.QuerySegmented'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "PATH_QUERY"}}',
                            },
                          },
                        },
                      },
                      AttributesFilter: {
                        type: 'object',
                        'x-component': 'AttributesFilter',
                        'x-reactions': {
                          dependencies: ['.FilterSegmented'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "ATTRIBUTES_FILTER"}}',
                            },
                          },
                        },
                      },
                      StatisticsFilter: {
                        type: 'object',
                        'x-component': 'StatisticsFilter',
                        'x-reactions': {
                          dependencies: ['.FilterSegmented'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "STATISTICS_FILTER"}}',
                            },
                          },
                        },
                      },
                    },
                  },
                  // 画布
                  GraphCanvas: {
                    type: 'object',
                    'x-component': 'GraphCanvas',
                    'x-decorator-props': {
                      style: {
                        flex: 1,
                      },
                    },
                    properties: {
                      GraphFilter: {
                        type: 'string',
                        'x-component': 'GraphFilter',
                      },
                      ContextMenu: {
                        type: 'string',
                        'x-component': 'ContextMenu',
                      },
                    },
                  },
                  // 画布右侧边栏
                  CanvasRightSider: {
                    type: 'object',
                    'x-decorator': 'CanvasSider',
                    'x-decorator-props': {
                      resizableProps: {
                        enable: {
                          top: false,
                          right: false,
                          bottom: false,
                          left: true,
                          topRight: false,
                          bottomRight: false,
                          bottomLeft: false,
                          topLeft: false,
                        },
                      },
                      handlerPosition: 'right',
                    },
                    properties: {
                      ElementInfo: {
                        type: 'string',
                        'x-component': 'ElementInfo',
                        'x-reactions': {
                          dependencies: ['....RightSiderContent'],
                          fulfill: {
                            state: {
                              visible: '{{$deps[0] === "ELEMENT_INFO"}}',
                            },
                          },
                        },
                      },
                    },
                    'x-reactions': {
                      dependencies: ['...RightSiderContent'],
                      fulfill: {
                        state: {
                          visible: '{{!!$deps[0]}}',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
