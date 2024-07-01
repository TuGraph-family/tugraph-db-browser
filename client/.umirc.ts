import { defineConfig } from 'umi';
import routes from './src/config/routes';
// import { GetEnvironmentVariables } from '../server/app/util';
import env from '../env.json';

process.env.MFSU_AD = 'none';

export const ANTD_VERSION = '4.24.0';
export const GI_SDK_APP_VERSION = '1.2.0';

export default defineConfig({
  // only proxy when using `umi dev`
  // if the assets are built, will not proxy
  hash: true,
  history: {
    type: 'hash',
  },
  outputPath:'./dist/resource',
  publicPath:'/resource/',
  styles: [
    `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.css`,
    `https://gw.alipayobjects.com/os/lib/antv/gi-sdk-app/${GI_SDK_APP_VERSION}/dist/index.css`,
  ],
  theme: {
    'primary-color': '#1650ff',
    'link-color': '#1650ff',
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    'antd/es/*': 'antd',
    moment: 'moment',
  },
  routes,
  headScripts: [
    'https://gw.alipayobjects.com/os/lib/react/18.1.0/umd/react.production.min.js',
    'https://gw.alipayobjects.com/os/lib/react-dom/18.1.0/umd/react-dom.production.min.js',

    // <!--- Antd DEPENDENCIES-->
    'https://gw.alipayobjects.com/os/lib/lodash/4.17.21/lodash.min.js',
    'https://gw.alipayobjects.com/os/lib/moment/2.29.1/moment.js',
    `https://gw.alipayobjects.com/os/lib/antd/${ANTD_VERSION}/dist/antd.min.js`,
    `https://gw.alipayobjects.com/os/lib/antv/gi-sdk-app/${GI_SDK_APP_VERSION}/dist/index.min.js`,
  ],
  npmClient: 'npm',
  favicons: [
    'https://gw.alipayobjects.com/zos/bmw-prod/6290edfc-e134-4074-a550-079eeba9926d.svg',
  ],
  esbuildMinifyIIFE: true,
  define: {
    'process.env': {
      // HOST: GetEnvironmentVariables(process.env),
      ...process.env,
      ...env,
    },
  },
  plugins: ['@umijs/plugins/dist/initial-state', '@umijs/plugins/dist/model'],
  initialState: {},
  model: {},
});
