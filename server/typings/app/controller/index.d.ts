// This file is created by egg-ts-helper@1.34.7
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportTugraphAuth from '../../../app/controller/tugraph/auth';
import ExportTugraphInfo from '../../../app/controller/tugraph/info';
import ExportTugraphQuery from '../../../app/controller/tugraph/query';
import ExportTugraphSchema from '../../../app/controller/tugraph/schema';
import ExportTugraphSubgraph from '../../../app/controller/tugraph/subgraph';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    tugraph: {
      auth: ExportTugraphAuth;
      info: ExportTugraphInfo;
      query: ExportTugraphQuery;
      schema: ExportTugraphSchema;
      subgraph: ExportTugraphSubgraph;
    }
  }
}
