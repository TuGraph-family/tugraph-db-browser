TuGraph DB BROWSER 🔗
TuGraph DB BROWSER 是 TuGraph 图数据库的可视化工具。可以完成图谱、模型、数据等的创建和导入。同时可用使用 TuGraph Cypher 进行数据的操作。

### 0. 环境准备

- node.js

### 1. 安装项目

```bash
yarn run bootstrap
```

### 2. 启动客户端
#### 2.1 开发环境

##### 2.1.1. web 端

```bash

# 开发环境
yarn run client-dev

```

##### 2.1.2 启动服务端

```bash

yarn run server-dev

```

浏览器访问 http://localhost:8888


#### 2.2 生产环境


```bash

# 安装依赖
yarn run bootstrap

# 构建
yarn run build

# 生产环境
yarn start

```

浏览器访问 http://localhost:7001


发布时打压缩包
```
tar -czvf tugraph-db-browser.tgz ./
```
