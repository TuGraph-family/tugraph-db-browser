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

  // TuGraph SubGraph
  router.get('/api/subgraph', controller.tugraph.subgraph.getSubGraphList);
};
