import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);

  // TuGraph Auth
  router.post('/login', controller.tugraph.auth.login);

  // TuGraph subGraph
  router.post('/api/subgraph', controller.tugraph.subgraph.createSubGraph)
  router.put('/api/subgraph', controller.tugraph.subgraph.updateSubGraph)
  router.delete('/api/subgraph', controller.tugraph.subgraph.deleteSubGraph)
  // router.get('/api/subgraph', controller.tugraph.subgraph.listSubGraph)
  router.get('/api/subgraph/:graphName', controller.tugraph.subgraph.subGraphDetailInfo)

  // TuGraph Schema
  // 点边数量
  router.get('/api/:graphName/count', controller.tugraph.schema.getVertexEdgeCount)
  // 点边类型数量
  router.get('/api/:graphName/schema/count', controller.tugraph.schema.getVertexEdgeSchemaCount)

  // TuGraph SubGraph
  router.get('/api/subgraph', controller.tugraph.subgraph.getSubGraphList);
  router.get('/api/:graphName/schema', controller.tugraph.schema.getSchema)
  router.post('/api:graphName/schema', controller.tugraph.schema.createSchema)
  // 更新 Schema
  router.put('/api:graphName/schema', controller.tugraph.schema.updateSchema)

  // 查询指定点边类型的Schema
  router.get('/api/:graphName/schema/:labelType/:labelName', controller.tugraph.schema.getSchemaByType)
};
