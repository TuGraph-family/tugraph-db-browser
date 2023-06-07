import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);

  // TuGraph Auth
  router.post('/login', controller.tugraph.auth.login);

  // TuGraph Data Query
  router.get(
    '/api/:graphName/vertex/:vertexId',
    controller.tugraph.query.queryVertexById
  );
  router.get(
    '/api/:graphName/language',
    app.controller.tugraph.query.queryByGraphLanguage
  );
  router.get(
    '/api/:graphName/neighbor',
    app.controller.tugraph.query.queryNeighbors
  );

  // TuGraph SubGraph
  router.get('/api/subgraph', controller.tugraph.subgraph.getSubGraphList);
};
