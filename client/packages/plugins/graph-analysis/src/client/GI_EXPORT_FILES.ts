export default {
  "workbook": {
    "id": "d72a7985-292f-4dc5-a9c9-c38f3e3639e5",
    "name": "admin",
    "activeAssetsKeys": {
      "elements": [
        "SimpleNode",
        "SimpleEdge"
      ],
      "components": [
        "ActivateRelations",
        "AdvanceNeighborsQuery",
        "CanvasSetting",
        "ClearCanvas",
        "ConfigQuery",
        "ContextMenu",
        "GraphDemo",
        "Initializer",
        "JSONMode",
        "LanguageQuery",
        "LassoSelect",
        "LayoutSwitchTool",
        "Loading",
        "PinNodeWithMenu",
        "Placeholder",
        "PointEdgeView",
        "PropertiesPanel",
        "PropertyGraphInitializer",
        "RichContainer",
        "SimpleQuery",
        "ToggleClusterWithMenu",
        "TuGraphAttributesFilter",
        "TuGraphBack",
        "TuGraphStatisticsFilter",
        "TuGraphStyleSetting",
        "ZoomStatus"
      ],
      "layouts": [
        "Force2",
        "Concentric",
        "Dagre",
        "FundForce"
      ]
    },
    "projectConfig": {
      "nodes": [
        {
          "id": "SimpleNode",
          "props": {
            "size": 26,
            "color": "#ddd",
            "label": []
          },
          "name": "官方节点",
          "order": -1,
          "expressions": [],
          "logic": true,
          "groupName": "默认样式"
        }
      ],
      "edges": [
        {
          "id": "SimpleEdge",
          "props": {
            "size": 1,
            "color": "#ddd",
            "label": []
          },
          "name": "官方边",
          "order": -1,
          "expressions": [],
          "logic": true,
          "groupName": "默认样式"
        }
      ],
      "components": [
        {
          "id": "ActivateRelations",
          "type": "AUTO",
          "name": "元素高亮",
          "props": {
            "enableNodeHover": true,
            "enableEdgeHover": true,
            "enable": true,
            "trigger": "click",
            "upstreamDegree": 1,
            "downstreamDegree": 1,
            "multiSelectEnabled": false,
            "modifierKey": "alt"
          }
        },
        {
          "id": "AdvanceNeighborsQuery",
          "type": "GIAC_MENU",
          "name": "高级邻居查询",
          "props": {
            "serviceId": "TuGraph-DB/neighborsQueryService",
            "languageServiceId": "TuGraph-DB/languageQueryService"
          }
        },
        {
          "id": "CanvasSetting",
          "type": "AUTO",
          "name": "画布设置",
          "props": {
            "styleCanvas": {
              "backgroundColor": "#fff",
              "backgroundImage": ""
            },
            "dragCanvas": {
              "disabled": false,
              "direction": "both",
              "enableOptimize": true
            },
            "zoomCanvas": {
              "disabled": false,
              "enableOptimize": true
            },
            "clearStatus": true,
            "doubleClick": true
          }
        },
        {
          "id": "ClearCanvas",
          "type": "GIAC",
          "name": "清空画布",
          "props": {
            "GI_CONTAINER_INDEX": 2,
            "GIAC": {
              "visible": false,
              "disabled": false,
              "isShowTitle": false,
              "title": "清空画布",
              "isShowIcon": true,
              "icon": "icon-tugraph-clear",
              "iconFontSize": "18px",
              "buttonType": "text",
              "isShowTooltip": true,
              "tooltip": "清空画布",
              "tooltipColor": "rgba(0,0,0,1)",
              "tooltipPlacement": "top",
              "hasDivider": false,
              "height": "46px",
              "isVertical": true
            }
          }
        },
        {
          "id": "ConfigQuery",
          "type": "GIAC_CONTENT",
          "name": "配置查询",
          "props": {
            "languageServiceId": "TuGraph-DB/languageQueryService",
            "schemaServiceId": "TuGraph-DB/graphSchemaService",
            "GI_CONTAINER_INDEX": 2,
            "GIAC_CONTENT": {
              "visible": false,
              "disabled": false,
              "isShowTitle": true,
              "title": "未命名组件",
              "isShowIcon": true,
              "icon": "icon-star",
              "isShowTooltip": true,
              "tooltip": "",
              "tooltipColor": "#3056e3",
              "tooltipPlacement": "right",
              "hasDivider": false,
              "height": "60px",
              "isVertical": true,
              "containerType": "div",
              "containerAnimate": false,
              "containerDraggable": false,
              "dragHandle": "header",
              "containerPlacement": "RT",
              "offset": [
                0,
                0
              ],
              "containerWidth": "350px",
              "containerHeight": "calc(100% - 100px)",
              "contaienrMask": false
            }
          }
        },
        {
          "id": "ContextMenu",
          "type": "GICC_MENU",
          "name": "右键菜单",
          "props": {
            "GI_CONTAINER": [
              "AdvanceNeighborsQuery",
              "ToggleClusterWithMenu",
              "PinNodeWithMenu"
            ],
            "nodeMenuComponents": [
              "NeighborsQuery",
              "ToggleClusterWithMenu",
              "PinNodeWithMenu"
            ]
          }
        },
        {
          "id": "GraphDemo",
          "type": "GIAC",
          "name": "Graph Demo 示例",
          "props": {
            "GI_CONTAINER_INDEX": 2,
            "GIAC": {
              "visible": false,
              "disabled": false,
              "isShowTitle": false,
              "title": "Demo 示例",
              "isShowIcon": true,
              "icon": "icon-xiaodengpao",
              "iconFontSize": "25px",
              "buttonType": "text",
              "isShowTooltip": true,
              "tooltip": "",
              "tooltipColor": "rgba(0,0,0,1)",
              "tooltipPlacement": "top",
              "hasDivider": false,
              "height": "46px",
              "isVertical": true
            }
          }
        },
        {
          "id": "Initializer",
          "type": "INITIALIZER",
          "name": "初始化器",
          "props": {
            "serviceId": "TuGraph-DB/GI_SERVICE_INTIAL_GRAPH",
            "schemaServiceId": "TuGraph-DB/GI_SERVICE_SCHEMA",
            "GI_INITIALIZER": true,
            "aggregate": false,
            "transByFieldMapping": false
          }
        },
        {
          "id": "JSONMode",
          "type": "GIAC_CONTENT",
          "name": "代码模式",
          "props": {
            "theme": "rjv-default",
            "GI_CONTAINER_INDEX": 2,
            "GIAC_CONTENT": {
              "visible": false,
              "disabled": false,
              "isShowTitle": true,
              "title": "代码模式",
              "isShowIcon": true,
              "icon": "icon-tugraph-code-view",
              "isShowTooltip": true,
              "tooltip": "将数据以代码形式展示",
              "tooltipColor": "#3056e3",
              "tooltipPlacement": "right",
              "hasDivider": false,
              "height": "60px",
              "isVertical": true,
              "containerType": "div",
              "containerAnimate": false,
              "containerDraggable": false,
              "dragHandle": "header",
              "containerPlacement": "RT",
              "offset": [
                0,
                0
              ],
              "containerWidth": "400px",
              "containerHeight": "calc(100% - 100px)",
              "contaienrMask": false
            }
          }
        },
        {
          "id": "LanguageQuery",
          "type": "GIAC_CONTENT",
          "name": "语句查询",
          "props": {
            "languageServiceId": "TuGraph-DB/languageQueryService",
            "GI_CONTAINER_INDEX": 2,
            "GIAC_CONTENT": {
              "visible": false,
              "disabled": false,
              "isShowTitle": true,
              "title": "未命名组件",
              "isShowIcon": true,
              "icon": "icon-star",
              "isShowTooltip": true,
              "tooltip": "",
              "tooltipColor": "#3056e3",
              "tooltipPlacement": "right",
              "hasDivider": false,
              "height": "60px",
              "isVertical": true,
              "containerType": "div",
              "containerAnimate": false,
              "containerDraggable": false,
              "dragHandle": "header",
              "containerPlacement": "RT",
              "offset": [
                0,
                0
              ],
              "containerWidth": "350px",
              "containerHeight": "calc(100% - 100px)",
              "contaienrMask": false
            }
          }
        },
        {
          "id": "LassoSelect",
          "type": "GIAC",
          "name": "自由圈选",
          "props": {
            "GI_CONTAINER_INDEX": 2,
            "GIAC": {
              "visible": false,
              "disabled": false,
              "isShowTitle": false,
              "title": "自由圈选",
              "isShowIcon": true,
              "icon": "icon-tugraph-lasso",
              "isShowTooltip": true,
              "tooltip": "套索",
              "tooltipColor": "rgba(0,0,0,1)",
              "tooltipPlacement": "top",
              "hasDivider": false,
              "height": "46px",
              "isVertical": true,
              "iconFontSize": "18px",
              "buttonType": "text"
            }
          }
        },
        {
          "id": "LayoutSwitchTool",
          "type": "GIAC",
          "name": "高级布局切换",
          "props": {
            "GI_CONTAINER_INDEX": 2,
            "GIAC": {
              "visible": false,
              "disabled": false,
              "isShowTitle": false,
              "title": "布局",
              "isShowIcon": true,
              "icon": "icon-tugraph-layout",
              "iconFontSize": "18px",
              "buttonType": "text",
              "isShowTooltip": true,
              "tooltip": "",
              "tooltipColor": "rgba(0,0,0,1)",
              "tooltipPlacement": "top",
              "hasDivider": false,
              "height": "46px",
              "isVertical": true
            }
          }
        },
        {
          "id": "Loading",
          "type": "AUTO",
          "name": "加载动画",
          "props": {}
        },
        {
          "id": "PinNodeWithMenu",
          "type": "GIAC_MENU",
          "name": "固定节点(MENU)",
          "props": {}
        },
        {
          "id": "Placeholder",
          "type": "AUTO",
          "name": "画布占位符",
          "props": {
            "img": "https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*1BGfQ78mW4kAAAAAAAAAAAAADmJ7AQ/original",
            "text": "画布为空时，请先试试查询-语句查询/配置查询",
            "width": 340,
            "textColor": "#999",
            "spacing": 8
          }
        },
        {
          "id": "PointEdgeView",
          "type": "AUTO",
          "name": "TuGraph 图例",
          "props": {}
        },
        {
          "id": "PropertiesPanel",
          "type": "AUTO",
          "name": "属性面板",
          "props": {
            "serviceId": "GI/PropertiesPanel",
            "title": "属性面板",
            "placement": "RT",
            "width": "356px",
            "height": "calc(100% - 0px)",
            "offset": [
              10,
              10
            ],
            "animate": false,
            "enableInfoDetect": true,
            "defaultiStatistic": false
          }
        },
        {
          "id": "PropertyGraphInitializer",
          "type": "AUTO",
          "name": "属性图计算",
          "props": {}
        },
        {
          "id": "RichContainer",
          "type": "GICC_LAYOUT",
          "name": "中台布局",
          "props": {
            "containers": [
              {
                "id": "navbar-left",
                "name": "导航左区",
                "required": true,
                "GI_CONTAINER": []
              },
              {
                "id": "navbar-right",
                "name": "导航右区",
                "required": true,
                "GI_CONTAINER": []
              },
              {
                "id": "view-mode",
                "name": "模式展示",
                "required": true,
                "GI_CONTAINER": [],
                "icon": "icon-deploymentunit1"
              },
              {
                "id": "data-query",
                "name": "数据查询",
                "required": true,
                "GI_CONTAINER": [],
                "icon": "icon-query"
              },
              {
                "id": "data-filter",
                "name": "数据筛选",
                "required": true,
                "GI_CONTAINER": [],
                "icon": "icon-filter"
              },
              {
                "id": "styling-setting",
                "name": "布局样式",
                "required": true,
                "GI_CONTAINER": []
              },
              {
                "id": "canvas-operator",
                "name": "画布操作",
                "required": true,
                "GI_CONTAINER": []
              }
            ],
            "isSheet": false
          }
        },
        {
          "id": "SimpleQuery",
          "type": "AUTO",
          "name": "简单查询",
          "props": {}
        },
        {
          "id": "ToggleClusterWithMenu",
          "type": "GIAC_MENU",
          "name": "展开/收起",
          "props": {
            "isReLayout": false,
            "degree": 1
          }
        },
        {
          "id": "TuGraphAttributesFilter",
          "type": "GIAC_CONTENT",
          "name": "属性筛选",
          "props": {
            "schemaServiceId": "TuGraph-DB/graphSchemaService",
            "GI_CONTAINER_INDEX": 2,
            "GIAC_CONTENT": {
              "visible": false,
              "disabled": false,
              "isShowTitle": true,
              "title": "未命名组件",
              "isShowIcon": true,
              "icon": "icon-star",
              "isShowTooltip": true,
              "tooltip": "",
              "tooltipColor": "#3056e3",
              "tooltipPlacement": "right",
              "hasDivider": false,
              "height": "60px",
              "isVertical": true,
              "containerType": "div",
              "containerAnimate": false,
              "containerDraggable": false,
              "dragHandle": "header",
              "containerPlacement": "RT",
              "offset": [
                0,
                0
              ],
              "containerWidth": "350px",
              "containerHeight": "calc(100% - 100px)",
              "contaienrMask": false
            }
          }
        },
        {
          "id": "TuGraphBack",
          "type": "GIAC",
          "name": "返回按钮",
          "props": {}
        },
        {
          "id": "TuGraphStatisticsFilter",
          "type": "GIAC_CONTENT",
          "name": "统计筛选",
          "props": {
            "schemaServiceId": "TuGraph-DB/graphSchemaService",
            "GI_CONTAINER_INDEX": 2,
            "GIAC_CONTENT": {
              "visible": false,
              "disabled": false,
              "isShowTitle": true,
              "title": "未命名组件",
              "isShowIcon": true,
              "icon": "icon-star",
              "isShowTooltip": true,
              "tooltip": "",
              "tooltipColor": "#3056e3",
              "tooltipPlacement": "right",
              "hasDivider": false,
              "height": "60px",
              "isVertical": true,
              "containerType": "div",
              "containerAnimate": false,
              "containerDraggable": false,
              "dragHandle": "header",
              "containerPlacement": "RT",
              "offset": [
                0,
                0
              ],
              "containerWidth": "350px",
              "containerHeight": "calc(100% - 100px)",
              "contaienrMask": false
            }
          }
        },
        {
          "id": "TuGraphStyleSetting",
          "type": "GIAC_CONTENT",
          "name": "样式设置",
          "props": {
            "localServiceId": "TuGraph-DB/saveElementStyleToLocalService",
            "schemaServiceId": "TuGraph-DB/graphSchemaService",
            "GI_CONTAINER_INDEX": -8,
            "GIAC_CONTENT": {
              "visible": false,
              "disabled": false,
              "isShowTitle": true,
              "title": "外观",
              "isShowIcon": true,
              "icon": "icon-tugraph-styling",
              "isShowTooltip": true,
              "tooltipColor": "rgba(0,0,0,1)",
              "tooltipPlacement": "right",
              "hasDivider": false,
              "height": "60px",
              "isVertical": true,
              "containerType": "div",
              "containerAnimate": false,
              "containerDraggable": false,
              "dragHandle": "header",
              "containerPlacement": "RT",
              "offset": [
                0,
                0
              ],
              "containerWidth": "350px",
              "containerHeight": "calc(100% - 100px)",
              "contaienrMask": false,
              "tooltip": "根据点上的属性值可指定颜色、大小、形状"
            }
          }
        },
        {
          "id": "ZoomStatus",
          "type": "AUTO",
          "name": "缩放状态",
          "props": {
            "minZoom": 0.6,
            "statusName": "minZoom"
          }
        }
      ],
      "layout": {
        "id": "Force2",
        "props": {
          "type": "force2",
          "animate": true,
          "preset": {
            "type": "concentric",
            "width": 800,
            "height": 800,
            "minNodeSpacing": 10,
            "nodeSize": 10
          },
          "clusterNodeStrength": 35,
          "minMovement": 2,
          "damping": 0.8,
          "maxSpeed": 1000,
          "distanceThresholdMode": "max",
          "edgeStrength": 200,
          "nodeStrength": 1000,
          "defSpringLenCfg": {
            "minLimitDegree": 5,
            "maxLimitLength": 500,
            "defaultSpring": 100
          },
          "centripetalOptions": {
            "leaf": 2,
            "single": 2,
            "others": 1
          },
          "advanceWeight": false,
          "edgeWeightFieldScale": 1,
          "nodeWeightFromType": "node",
          "nodeWeightFieldScale": 1,
          "directed": false,
          "directedFromType": "node",
          "directedIsLog": true,
          "directedMultiple": "0.1"
        }
      },
      "pageLayout": {
        "id": "RichContainer",
        "name": "中台布局",
        "type": "GICC_LAYOUT",
        "props": {
          "containers": [
            {
              "id": "navbar-left",
              "name": "导航左区",
              "required": true,
              "GI_CONTAINER": [
                {
                  "value": "TuGraphBack",
                  "label": "返回按钮"
                }
              ],
              "display": true
            },
            {
              "id": "navbar-right",
              "name": "导航右区",
              "required": true,
              "GI_CONTAINER": [
                "GraphDemo"
              ],
              "display": true
            },
            {
              "id": "view-mode",
              "name": "模式展示",
              "required": true,
              "GI_CONTAINER": [
                {
                  "value": "JSONMode",
                  "label": "代码模式"
                }
              ],
              "icon": "icon-tugraph-graph-view",
              "display": true
            },
            {
              "id": "data-query",
              "name": "数据查询",
              "required": true,
              "GI_CONTAINER": [
                {
                  "value": "LanguageQuery",
                  "label": "语句查询"
                },
                {
                  "value": "ConfigQuery",
                  "label": "配置查询"
                }
              ],
              "icon": "icon-tugraph-query",
              "display": true
            },
            {
              "id": "data-filter",
              "name": "数据筛选",
              "required": true,
              "GI_CONTAINER": [
                {
                  "value": "TuGraphAttributesFilter",
                  "label": "属性筛选"
                },
                {
                  "value": "TuGraphStatisticsFilter",
                  "label": "统计筛选"
                }
              ],
              "icon": "icon-tugraph-filter",
              "display": true
            },
            {
              "id": "styling-setting",
              "name": "布局样式",
              "required": true,
              "GI_CONTAINER": [
                {
                  "value": "TuGraphStyleSetting",
                  "label": "业务样式设置"
                },
                {
                  "value": "LayoutSwitchTool",
                  "label": "高级布局切换"
                }
              ],
              "display": true
            },
            {
              "id": "canvas-operator",
              "name": "画布操作",
              "required": true,
              "GI_CONTAINER": [
                {
                  "value": "LassoSelect",
                  "label": "自由圈选"
                },
                {
                  "value": "ClearCanvas",
                  "label": "清空画布"
                }
              ],
              "display": true
            },
            {
              "id": "GI_FreeContainer",
              "name": "自运行组件",
              "required": true,
              "info": {
                "id": "GI_FreeContainer",
                "name": "自运行组件",
                "icon": "icon-layout",
                "type": "GICC"
              },
              "meta": {
                "GI_CONTAINER": {
                  "x-component-props": {
                    "mode": "multiple"
                  }
                },
                "id": "GI_FreeContainer",
                "name": "自运行组件",
                "required": true
              },
              "props": {
                "id": "GI_FreeContainer",
                "GI_CONTAINER": [
                  {
                    "value": "CanvasSetting",
                    "label": "画布设置"
                  },
                  {
                    "value": "Initializer",
                    "label": "初始化器"
                  },
                  {
                    "value": "ActivateRelations",
                    "label": "元素高亮"
                  },
                  {
                    "value": "Copyright",
                    "label": "版权"
                  },
                  {
                    "value": "Loading",
                    "label": "加载动画"
                  },
                  {
                    "value": "NodeLegend",
                    "label": "节点图例"
                  },
                  {
                    "value": "Placeholder",
                    "label": "画布占位符"
                  },
                  {
                    "value": "PropertiesPanel",
                    "label": "属性面板"
                  },
                  {
                    "value": "PropertyGraphInitializer",
                    "label": "属性图计算"
                  }
                ]
              },
              "candidateAssets": [
                {
                  "label": "元素高亮",
                  "value": "ActivateRelations"
                },
                {
                  "label": "画布设置",
                  "value": "CanvasSetting"
                },
                {
                  "label": "版权",
                  "value": "Copyright"
                },
                {
                  "label": "加载动画",
                  "value": "Loading"
                },
                {
                  "label": "小地图",
                  "value": "MiniMap"
                },
                {
                  "label": "节点图例",
                  "value": "NodeLegend"
                },
                {
                  "label": "画布占位符",
                  "value": "Placeholder"
                },
                {
                  "label": "属性面板",
                  "value": "PropertiesPanel"
                },
                {
                  "label": "节点提示框",
                  "value": "Tooltip"
                },
                {
                  "label": "初始化器",
                  "value": "Initializer"
                },
                {
                  "label": "属性图计算",
                  "value": "PropertyGraphInitializer"
                },
                {
                  "label": "水印",
                  "value": "Watermark"
                },
                {
                  "label": "缩放状态",
                  "value": "ZoomStatus"
                },
                {
                  "label": "分析历史沉淀",
                  "value": "AnalysisHistory"
                },
                {
                  "label": "AI 助理",
                  "value": "Assistant"
                },
                {
                  "label": "计数器",
                  "value": "Counter"
                },
                {
                  "label": "简单查询",
                  "value": "SimpleQuery"
                },
                {
                  "label": "demo案例",
                  "value": "Demo"
                }
              ],
              "GI_CONTAINER": [
                "CanvasSetting",
                "Initializer",
                "ActivateRelations",
                "Loading",
                "Placeholder",
                "PointEdgeView",
                "PropertiesPanel",
                "PropertyGraphInitializer",
                "SimpleQuery",
                "ZoomStatus"
              ],
              "display": true
            }
          ]
        }
      }
    },
    "themes": [
      {
        "canvasConfig": {
          "styleCanvas": {
            "backgroundColor": "#fff",
            "backgroundImage": "https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ",
            "background": "#fff"
          },
          "dragCanvas": {
            "disabled": false,
            "direction": "both",
            "enableOptimize": true
          },
          "zoomCanvas": {
            "disabled": false,
            "enableOptimize": true
          },
          "clearStatus": true,
          "doubleClick": true
        },
        "nodesConfig": [
          {
            "id": "SimpleNode",
            "props": {
              "size": 26,
              "color": "#ddd",
              "label": [],
              "advanced": {
                "label": {
                  "fill": "#000"
                }
              }
            },
            "name": "官方节点",
            "order": -1,
            "expressions": [],
            "logic": true,
            "groupName": "默认样式"
          }
        ],
        "edgesConfig": [
          {
            "id": "SimpleEdge",
            "props": {
              "size": 1,
              "color": "#ddd",
              "label": []
            },
            "name": "官方边",
            "order": -1,
            "expressions": [],
            "logic": true,
            "groupName": "默认样式"
          }
        ],
        "name": "清新蓝",
        "id": "light",
        "primaryColor": "rgb(48, 86, 227)"
      },
      {
        "canvasConfig": {
          "styleCanvas": {
            "backgroundColor": "#fff",
            "backgroundImage": "https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ",
            "background": "#fff"
          },
          "dragCanvas": {
            "disabled": false,
            "direction": "both",
            "enableOptimize": true
          },
          "zoomCanvas": {
            "disabled": false,
            "enableOptimize": true
          },
          "clearStatus": true,
          "doubleClick": true
        },
        "nodesConfig": [
          {
            "id": "SimpleNode",
            "props": {
              "size": 26,
              "color": "#ddd",
              "label": [],
              "advanced": {
                "label": {
                  "fill": "#000"
                }
              }
            },
            "name": "官方节点",
            "order": -1,
            "expressions": [],
            "logic": true,
            "groupName": "默认样式"
          }
        ],
        "edgesConfig": [
          {
            "id": "SimpleEdge",
            "props": {
              "size": 1,
              "color": "#ddd",
              "label": []
            },
            "name": "官方边",
            "order": -1,
            "expressions": [],
            "logic": true,
            "groupName": "默认样式"
          }
        ],
        "name": "暖阳橙",
        "id": "ali",
        "primaryColor": "rgb(255, 106, 0)"
      },
      {
        "canvasConfig": {
          "styleCanvas": {
            "backgroundColor": "#1f1f1f",
            "backgroundImage": "https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ",
            "background": "#1f1f1f"
          },
          "dragCanvas": {
            "disabled": false,
            "direction": "both",
            "enableOptimize": true
          },
          "zoomCanvas": {
            "disabled": false,
            "enableOptimize": true
          },
          "clearStatus": true,
          "doubleClick": true
        },
        "nodesConfig": [
          {
            "id": "SimpleNode",
            "props": {
              "size": 26,
              "color": "#ddd",
              "label": [],
              "advanced": {
                "label": {
                  "fill": "#fff"
                }
              }
            },
            "name": "官方节点",
            "order": -1,
            "expressions": [],
            "logic": true,
            "groupName": "默认样式"
          }
        ],
        "edgesConfig": [
          {
            "id": "SimpleEdge",
            "props": {
              "size": 1,
              "color": "#ddd",
              "label": []
            },
            "name": "官方边",
            "order": -1,
            "expressions": [],
            "logic": true,
            "groupName": "默认样式"
          }
        ],
        "name": "暗夜黑",
        "id": "dark",
        "primaryColor": "rgb(31, 31, 31)"
      },
      {
        "canvasConfig": {
          "styleCanvas": {
            "backgroundColor": "#fff",
            "backgroundImage": "https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*k9t4QamMuQ4AAAAAAAAAAAAAARQnAQ",
            "background": "#fff"
          },
          "dragCanvas": {
            "disabled": false,
            "direction": "both",
            "enableOptimize": true
          },
          "zoomCanvas": {
            "disabled": false,
            "enableOptimize": true
          },
          "clearStatus": true,
          "doubleClick": true
        },
        "nodesConfig": [
          {
            "id": "SimpleNode",
            "props": {
              "size": 26,
              "color": "#ddd",
              "label": [],
              "advanced": {
                "label": {
                  "fill": "#000"
                }
              }
            },
            "name": "官方节点",
            "order": -1,
            "expressions": [],
            "logic": true,
            "groupName": "默认样式"
          }
        ],
        "edgesConfig": [
          {
            "id": "SimpleEdge",
            "props": {
              "size": 1,
              "color": "#ddd",
              "label": []
            },
            "name": "官方边",
            "order": -1,
            "expressions": [],
            "logic": true,
            "groupName": "默认样式"
          }
        ],
        "name": "芒种绿",
        "id": "green",
        "primaryColor": "rgb(39,118,88)"
      }
    ],
    "theme": "light"
  },
  "dataset": {
    "id": "ds_504f732b-891d-4ff6-b807-430d9cc69cb8",
    "engineContext": {
      "engineId": "TuGraph-DB",
      "schemaData": {
        "nodes": [],
        "edges": []
      },
      "name": "TuGraph 服务",
      "HTTP_SERVER_URL": `http://${window.location.hostname}:7001`
    },
    "engineId": "TuGraph-DB",
    "name": "TuGraph 服务",
    "schemaData": {
      "nodes": [],
      "edges": []
    },
    "data": {
      "transData": {
        "nodes": [],
        "edges": []
      }
    }
  },
  "deps": {
    "React": {
      "url": "https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js",
      "name": "react-dom",
      "version": "17.0.2",
      "global": "React"
    },
    "ReactDOM": {
      "url": "https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js",
      "name": "react-dom",
      "version": "17.0.2",
      "global": "ReactDOM"
    },
    "_": {
      "name": "lodash",
      "version": "4.17.21",
      "global": "_",
      "url": "https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js"
    },
    "antd": {
      "url": "https://gw.alipayobjects.com/os/lib/antd/4.24.8/dist/antd.min.js",
      "name": "antd",
      "version": "4.24.8",
      "global": "antd"
    },
    "G6": {
      "url": "https://gw.alipayobjects.com/os/lib/antv/g6/4.8.14/dist/g6.min.js",
      "name": "@antv/g6",
      "version": "4.8.14",
      "global": "G6"
    },
    "Graphin": {
      "url": "https://gw.alipayobjects.com/os/lib/antv/graphin/2.7.25/dist/graphin.min.js",
      "name": "@antv/graphin",
      "version": "2.7.25",
      "global": "Graphin"
    },
    "GISDK": {
      "name": "@antv/gi-sdk",
      "version": "2.4.10",
      "url": "https://gw.alipayobjects.com/os/lib/antv/gi-sdk/2.4.10/dist/index.min.js",
      "global": "GISDK"
    },
    "G2Plot": {
      "url": "https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js",
      "name": "@antv/g2plot",
      "version": "2.4.16",
      "global": "G2Plot"
    },
    "@antv/gi-theme-antd": {
      "name": "@antv/gi-theme-antd",
      "version": "0.6.5",
      "url": "https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.6.5/dist/index.min.js",
      "global": "GI_THEME_ANTD"
    }
  },
  "GI_ASSETS_PACKAGES": {
    "GI_ASSETS_BASIC": {
      "name": "@antv/gi-assets-basic",
      "version": "2.4.14",
      "url": "https://gw.alipayobjects.com/os/lib/antv/gi-assets-basic/2.4.14/dist/index.min.js",
      "global": "GI_ASSETS_BASIC"
    },
    "GI_ASSETS_ADVANCE": {
      "name": "@antv/gi-assets-advance",
      "version": "2.5.12",
      "url": "https://gw.alipayobjects.com/os/lib/antv/gi-assets-advance/2.5.12/dist/index.min.js",
      "global": "GI_ASSETS_ADVANCE"
    },
    "GI_ASSETS_TUGRAPH_DB": {
      "name": "@tugraph/gi-assets-tugraph-db",
      "version": "0.6.12",
      "global": "GI_ASSETS_TUGRAPH_DB",
      "url": "https://gw.alipayobjects.com/os/lib/tugraph/gi-assets-tugraph-db/0.6.12/dist/index.min.js"
    }
  }
}