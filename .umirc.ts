import { defineConfig } from 'umi';

export default defineConfig({
  hash: true,
  title: 'TuGraph DB',
  history: {
    type: 'hash',
  },
  outputPath: './dist/resource',
  publicPath: '/resource/',
  theme: {
    '@primary-color': '#1650FF',
    '@border-radius-base': '6px',
    '@collapse-panel-border-radius': '6px',
    '@checkbox-border-radius': '4px',
    '@tag-border-radius': '4px',
    '@text-color': '#363740',
    '@heading-color': '#363740',
    '@text-color-dark': '#363740',
  },
  routes: [
    { path: '/', component: 'studio', title: '图项目' },
    { path: '/login', component: 'login', title: '登录' },
    { path: '/home', component: 'studio', title: '图项目' },
    { path: '/console', component: 'console', title: '控制台' },
    { path: '/construct', component: 'construct', title: '图构建' },
    { path: '/analysis', component: 'graph-schema/index', title: '图分析' },
    { path: '/query', component: 'query', title: '图查询' },
    { path: '/reset', component: 'resetPassword', title: '重置密码' },
  ],
  npmClient: 'npm',
  favicons: ['/resource/assets/favicon.png'],
  esbuildMinifyIIFE: true,
  plugins: [
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
    '@umijs/plugins/dist/antd',
  ],
  initialState: {},
  model: {},
  antd: {
    import: true,
  },
});
