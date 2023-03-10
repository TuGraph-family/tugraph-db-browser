import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  router.get('/', controller.home.index);

  // TuGraph Data Query
  router.post('/api/:graphName/vertex/:vertexId', controller.tugraph.query.queryVertexById);

  // TuGraph Schema

};
