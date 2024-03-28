TuGraph DB BROWSER 🔗
TuGraph DB BROWSER 是 TuGraph 图数据库的可视化工具。可以完成图谱、模型、数据等的创建和导入。同时可用使用 TuGraph Cypher 进行数据的操作。

### 0. 环境准备

- node.js

### 1. 安装项目

```bash
pnpm install
```

### 2. 启动项目

```bash
pnpm run dev // 本地调试
pnpm run start // 生产环境界
```

#### 2.1 配置服务器地址

```bash
env.json
{
  "tugraph_db_host": "http://47.105.42.70:9090" // 替换可用服务
}
```

##### 2.1.1. web 端

`````bash


浏览器访问 http://localhost:8000

##### 注意 ⚠️ 2.1.3 本地调试

上一步 `pnpm run server-dev` 启动的只是本地一个代理服务器，用于连接的 `TuGraph-db`服务，那么 `TuGraph-db`本身的服务地址在 `server/app/service/tugraph/constant.ts` 中，默认的`HOST_URL` 值是 docker 启动地址 `127.0.0.1:9090`,如果是云环境，请修改这里,例如 `http://x.x.x.x:9090`

#### 2.2 生产环境

```bash

# 安装依赖
pnpm run install

# 构建
yarn run build
# 本地环境
pnpm run dev
# 生产环境
pnpm run start

````bash

浏览器访问 http://localhost:7001

发布时打压缩包

```bash
tar -czvf tugraph-db-browser.tgz ./
```
`````
