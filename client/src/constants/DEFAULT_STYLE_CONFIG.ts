// 官网默认提供的子图的默认样式
export default {
  // Movie
  person: {
    color: 'rgb(64 137 255)',
    displayLabel: ['name'],
    icon: {
      iconText: 'renyuan'
    },
    isShowText: true,
    labelText: 'property',
    nodeType: 'person',
    size: 30
  },
  user: {
    color: 'rgb(88 136 195)',
    displayLabel: ['login'],
    icon: {
      iconText: 'duoren'
    },
    isShowText: true,
    labelText: 'property',
    nodeType: 'user',
    size: 30
  },
  movie: {
    color: "rgb(255 136 52)",
    displayLabel: ['title'],
    icon: {
      iconText: 'shebei'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "movie",
    size: 30
  },
  keyword: {
    color: "rgb(6 184 168)",
    displayLabel: ['name'],
    icon: {
      iconText: 'yingyezhizhao'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "keyword",
    size: 30
  },
  acted_in: {
    color: '#99add1',
    displayLabel: 'label',
    edgeType: 'acted_in',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  rate: {
    color: 'rgb(64 137 255)',
    displayLabel: 'label',
    edgeType: 'rate',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  directed: {
    color: 'rgb(204 116 255)',
    displayLabel: 'label',
    edgeType: 'directed',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  is_friend: {
    color: 'rgb(6 184 168)',
    displayLabel: 'label',
    edgeType: 'is_friend',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  has_genre: {
    color: 'rgb(255 136 52)',
    displayLabel: 'label',
    edgeType: 'has_genre',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  has_keyword: {
    color: 'rgb(88 136 195)',
    displayLabel: 'label',
    edgeType: 'has_keyword',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  produce: {
    color: 'rgb(250 115 205)',
    displayLabel: 'label',
    edgeType: 'produce',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  write: {
    color: '#cb962a',
    displayLabel: 'label',
    edgeType: 'write',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },

  // TheThreeBody
  organization: {
    color: 'rgb(204 116 255)',
    displayLabel: ['name'],
    icon: {
      iconText: 'gongsi'
    },
    isShowText: true,
    labelText: 'property',
    nodeType: 'organization',
    size: 30
  },
  time: {
    color: 'rgb(255 136 52)',
    displayLabel: ['name'],
    icon: {
      iconText: 'Wi-Fi'
    },
    isShowText: true,
    labelText: 'property',
    nodeType: 'time',
    size: 30
  },
  plan: {
    color: 'rgb(6 184 168)',
    displayLabel: ['name'],
    icon: {
      iconText: 'IPdizhi'
    },
    isShowText: true,
    labelText: 'property',
    nodeType: 'plan',
    size: 30
  },
  person_person: {
    color: '#99add1',
    displayLabel: 'label',
    edgeType: 'person_person',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  person_plan: {
    color: 'rgb(64 137 255)',
    displayLabel: 'label',
    edgeType: 'person_plan',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  person_organization: {
    color: 'rgb(204 116 255)',
    displayLabel: 'label',
    edgeType: 'person_organization',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  organization_plan: {
    color: 'rgb(6 184 168)',
    displayLabel: 'label',
    edgeType: 'organization_plan',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  organization_organization: {
    color: 'rgb(255 136 52)',
    displayLabel: 'label',
    edgeType: 'organization_organization',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  time_time: {
    color: 'rgb(88 136 195)',
    displayLabel: 'label',
    edgeType: 'time_time',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },

  // ThreeKingdoms
  '主公': {
    color: "rgb(64 137 255)",
    displayLabel: ['name'],
    icon: {
      iconText: 'duoren'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "主公",
    size: 30
  },
  '州': {
    color: "rgb(204 116 255)",
    displayLabel: ['name'],
    icon: {
      iconText: 'dizhi'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "州",
    size: 30
  },
  '战役': {
    color: "rgb(88 136 195)",
    displayLabel: ['name'],
    icon: {
      iconText: 'yingyezhizhao'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "战役",
    size: 30
  },
  '文臣': {
    color: "rgb(6 184 168)",
    displayLabel: ['name'],
    icon: {
      iconText: 'qinshu'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "文臣",
    size: 30
  },
  '武将': {
    color: "rgb(255 136 52)",
    displayLabel: ['name'],
    icon: {
      iconText: 'renyuan'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "武将",
    size: 30
  },
  '父亲': {
    color: '#99add1',
    displayLabel: 'label',
    edgeType: '父亲',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  '兄长': {
    color: 'rgb(64 137 255)',
    displayLabel: 'label',
    edgeType: '兄长',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  '隶属': {
    color: 'rgb(204 116 255)',
    displayLabel: 'label',
    edgeType: '隶属',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  '籍贯': {
    color: 'rgb(6 184 168)',
    displayLabel: 'label',
    edgeType: '籍贯',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  '参战': {
    color: 'rgb(255 136 52)',
    displayLabel: 'label',
    edgeType: '参战',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },

  // WanderingEarth
  '天体与设施': {
    color: "rgb(64 137 255)",
    displayLabel: ['name'],
    icon: {
      iconText: 'Wi-Fi'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "天体与设施",
    size: 30
  },
  '组织': {
    color: "rgb(204 116 255)",
    displayLabel: ['name'],
    icon: {
      iconText: 'duoren'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "组织",
    size: 30
  },
  '角色': {
    color: "rgb(6 184 168)",
    displayLabel: ['name'],
    icon: {
      iconText: 'renyuan'
    },
    isShowText: true,
    labelText: "property",
    nodeType: "角色",
    size: 30
  },
  '关系': {
    color: '#99add1',
    displayLabel: 'label',
    edgeType: '关系',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
  '事件关系': {
    color: 'rgb(64 137 255)',
    displayLabel: 'label',
    edgeType: '事件关系',
    isShowText: true,
    labelText: "label",
    lineWidth: 1
  },
}