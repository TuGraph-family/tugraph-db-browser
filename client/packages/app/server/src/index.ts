import { Application } from '@tugraph/openpiece-server';
import config from './config';
import koa from '@koa/router';
import path from 'path';
import fs from 'fs';
import koaStatic from 'koa-static';

const router = koa();
const app = new Application(config);

if (require.main === module) {
  app.runAsCLI();
}
router.get(/^(?!\/api)\/.*/, async (ctx, next) => {
  ctx.type = 'html';
  ctx.body = fs.createReadStream(path.resolve(__dirname, '../../client/dist/index.html'));
});
const filePath = path.resolve(__dirname, '../../client/dist');
app.use(koaStatic(filePath));
app.use(router.routes()).use(router.allowedMethods());
export default app;
