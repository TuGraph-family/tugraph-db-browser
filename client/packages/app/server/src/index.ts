import { Application } from '@tugraph/openpiece-server';
import config from './config';

const app = new Application(config);

if (require.main === module) {
  app.runAsCLI();
}

export default app;
