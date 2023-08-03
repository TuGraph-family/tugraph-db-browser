import {
  getUmiConfig,
  resolveNocobasePackagesAlias,
} from '@tugraph/openpiece-devtools';
import { defineConfig } from 'umi';

const umiConfig = getUmiConfig();

process.env.MFSU_AD = 'none';
const GRAPHIN_VERSION = '2.7.24';
const G6_VERSION = '4.8.20';
const ANTD_VERSION = '4.23.5';
const GI_SDK_APP_VERSION = '1.1.1';

export default defineConfig({
  hash: true,
  define: {
    ...umiConfig.define,
  },
  dynamicImportSyntax: {},
  // only proxy when using `umi dev`
  // if the assets are built, will not proxy
  proxy: {
    ...umiConfig.proxy,
  },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', exact: false, component: '@/pages/index' }],
  // fastRefresh: {},
  chainWebpack(config) {
    resolveNocobasePackagesAlias(config);
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    '@antv/g2plot': 'G2Plot',
    'antd/es/*': 'antd',
    '@ant-design/charts': 'charts',
    '@ant-design/icons': 'icons',
    moment: 'moment',
    '@antv/g6': 'G6',
    '@antv/graphin': 'Graphin',
  },
  headScripts: [
    'https://gw.alipayobjects.com/os/lib/localforage/1.10.0/dist/localforage.min.js',
  ],
  scripts: [
    'https://gw.alipayobjects.com/os/lib/react/17.0.2/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/17.0.2/umd/react-dom.production.min.js',

    // <!--- Antd DEPENDENCIES-->
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    'https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js',
    `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.min.js`,
    'https://gw.alipayobjects.com/os/lib/ant-design/charts/1.2.13/dist/charts.min.js',
    'https://gw.alipayobjects.com/os/lib/ant-design/icons/4.6.4/dist/index.umd.min.js',
    // <!--- G2/G2Plot DEPENDENCIES-->
    `https://gw.alipayobjects.com/os/lib/antv/g6/${G6_VERSION}/dist/g6.min.js`,
    `https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/graphin.min.js`,
    'https://gw.alipayobjects.com/os/lib/antv/g2plot/2.4.16/dist/g2plot.min.js',
    `https://gw.alipayobjects.com/os/lib/antv/gi-sdk-app/${GI_SDK_APP_VERSION}/dist/index.min.js`,
  ],
  styles: [
    `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.css`,
    `https://gw.alipayobjects.com/os/lib/antv/graphin/${GRAPHIN_VERSION}/dist/index.css`,
    `https://gw.alipayobjects.com/os/lib/antv/gi-sdk-app/${GI_SDK_APP_VERSION}/dist/index.css`,
  ],
  theme: {
    'primary-color': '#1650ff',
    'link-color': '#1650ff',
  },
});
