// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportTugraphAuth from '../../../app/controller/tugraph/auth';
import ExportTugraphData from '../../../app/controller/tugraph/data';
import ExportTugraphInfo from '../../../app/controller/tugraph/info';
import ExportTugraphQuery from '../../../app/controller/tugraph/query';
import ExportTugraphSchema from '../../../app/controller/tugraph/schema';
import ExportTugraphSubgraph from '../../../app/controller/tugraph/subgraph';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    tugraph: {
      auth: ExportTugraphAuth;
      data: ExportTugraphData;
      info: ExportTugraphInfo;
      query: ExportTugraphQuery;
      schema: ExportTugraphSchema;
      subgraph: ExportTugraphSubgraph;
    }
  }
}
