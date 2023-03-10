// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportTugraphQuery from '../../../app/controller/tugraph/query';
import ExportTugraphSchema from '../../../app/controller/tugraph/schema';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    tugraph: {
      query: ExportTugraphQuery;
      schema: ExportTugraphSchema;
    }
  }
}
