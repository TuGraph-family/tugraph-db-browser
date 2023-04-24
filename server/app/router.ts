import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);

  // TuGraph Auth
  router.post('/login', controller.tugraph.auth.login);
  router.post('/api/auth/user', controller.tugraph.auth.createUser);
  router.delete('/api/auth/user', controller.tugraph.auth.deleteUser);
  router.put(
    '/api/auth/disable',
    controller.tugraph.auth.setUserDisabledStatus
  );

  // TuGraph subGraph
  router.get('/api/subgraph', controller.tugraph.subgraph.getSubGraphList);
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
  router.get(
    '/api/statistics/:graphName',
    controller.tugraph.schema.vertexEdgeStatistics
  );

  // 点边类型数量
  router.get(
    '/api/statistics/:graphName/labels',
    controller.tugraph.schema.getVertexEdgeSchemaCount
  );

  // 点边数量
  router.get(
    '/api/statistics/:graphName/count',
    controller.tugraph.schema.getVertexEdgeCount
  );

  router.get('/api/schema/:graphName', controller.tugraph.schema.getSchema);
  router.post('/api/schema/:graphName', controller.tugraph.schema.createSchema);
  router.delete(
    '/api/schema/:graphName',
    controller.tugraph.schema.deleteSchema
  );

  // 查询指定点边类型的Schema
  router.get(
    '/api/schema/:graphName/:labelType/:labelName',
    controller.tugraph.schema.getSchemaByType
  );

  // 指定点边的 Schema 修改
  router.post(
    '/api/property/:graphName',
    controller.tugraph.schema.createProperty
  );
  router.put(
    '/api/property/:graphName',
    controller.tugraph.schema.updateProperty
  );
  router.delete(
    '/api/property/:graphName',
    controller.tugraph.schema.deleteProperty
  );

  // 索引相关
  router.post('/api/index/:graphName', controller.tugraph.schema.createIndex);
  router.delete('/api/index/:graphName', controller.tugraph.schema.deleteIndex);

  // 系统信息相关
  router.get('/api/info/system', controller.tugraph.info.querySystemInfo);
  router.get('/api/info/database', controller.tugraph.info.queryDatabaseInfo);
};
