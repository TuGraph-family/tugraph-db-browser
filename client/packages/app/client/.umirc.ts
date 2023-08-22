import {
  getUmiConfig,
  resolveNocobasePackagesAlias,
} from '@tugraph/openpiece-devtools';
import { defineConfig } from 'umi';

const umiConfig = getUmiConfig();

process.env.MFSU_AD = 'none';

const ANTD_VERSION = '4.23.5';
const GI_SDK_APP_VERSION = '1.2.0';

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

    `https://gw.alipayobjects.com/os/lib/antv/gi-sdk-app/${GI_SDK_APP_VERSION}/dist/index.min.js`,
  ],
  styles: [
    `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.css`,
    `https://gw.alipayobjects.com/os/lib/antv/gi-sdk-app/${GI_SDK_APP_VERSION}/dist/index.css`,
  ],
  theme: {
    'primary-color': '#1650ff',
    'link-color': '#1650ff',
  },
});
