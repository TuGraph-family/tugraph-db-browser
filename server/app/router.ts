import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);

  // TuGraph Auth
  router.post('/login', controller.tugraph.auth.login);

  // TuGraph subGraph
  router.post('/api/subgraph', controller.tugraph.subgraph.createSubGraph);
  router.put('/api/subgraph', controller.tugraph.subgraph.updateSubGraph);
  router.delete('/api/subgraph', controller.tugraph.subgraph.deleteSubGraph);
  router.get(
    '/api/subgraph/:graphName',
    controller.tugraph.subgraph.subGraphDetailInfo
  );
  router.get('/api/subgraph', controller.tugraph.subgraph.getSubGraphList);

  // TuGraph Schema
  // 点边统计，包括点边类型数量及数据库中点边数据数量
  router.get('/api/statistics/:graphName', controller.tugraph.schema.vertexEdgeStatistics)

  // 点边类型数量 
  router.get('/api/statistics/:graphName/labels', controller.tugraph.schema.getVertexEdgeSchemaCount)

  // 点边数量
  router.get('/api/statistics/:graphName/count', controller.tugraph.schema.getVertexEdgeCount)

  router.get('/api/schema/:graphName', controller.tugraph.schema.getSchema)
  router.post('/api/schema/:graphName', controller.tugraph.schema.createSchema)
  // 更新 Schema
  router.put('/api/schema:graphName', controller.tugraph.schema.updateSchema)

  // 查询指定点边类型的Schema
  router.get('/api/schema/:graphName/:labelType/:labelName', controller.tugraph.schema.getSchemaByType)

  // 索引相关
  router.post('/api/indexs/:graphName', controller.tugraph.schema.createIndex)
  router.delete('/api/indexs/:graphName', controller.tugraph.schema.deleteIndex)
};
