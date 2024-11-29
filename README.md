# TuGraph DB BROWSER 🔗

TuGraph DB BROWSER 是 TuGraph 图数据库的可视化平台。可以完成图谱、模型、数据等的创建和导入。同时可用使用 TuGraph Cypher 进行数据的操作。

## 0. 环境准备

- node.js >= 16

## 1. 安装项目依赖

```bash
npm install --force
```

## 2. 本地研发

```bash
npm run dev
```

浏览器访问 http://localhost:8000

## 3. 编译构建

通用环境编译命令
```bash
npm run build
```


cosmos 私有化部署环境编译命令, 其中 xxx 可以指定拼接的 prefixPath
```bash
npm run custom-build xxx
```
