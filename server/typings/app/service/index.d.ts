// This file is created by egg-ts-helper@1.35.1
// Do not modify this file!!!!!!!!!
/* eslint-disable */

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportTugraphAuth from '../../../app/service/tugraph/auth';
import ExportTugraphConstant from '../../../app/service/tugraph/constant';
import ExportTugraphData from '../../../app/service/tugraph/data';
import ExportTugraphInfo from '../../../app/service/tugraph/info';
import ExportTugraphInterface from '../../../app/service/tugraph/interface';
import ExportTugraphQuery from '../../../app/service/tugraph/query';
import ExportTugraphSchema from '../../../app/service/tugraph/schema';
import ExportTugraphSubgraph from '../../../app/service/tugraph/subgraph';

declare module 'egg' {
  interface IService {
    tugraph: {
      auth: AutoInstanceType<typeof ExportTugraphAuth>;
      constant: AutoInstanceType<typeof ExportTugraphConstant>;
      data: AutoInstanceType<typeof ExportTugraphData>;
      info: AutoInstanceType<typeof ExportTugraphInfo>;
      interface: AutoInstanceType<typeof ExportTugraphInterface>;
      query: AutoInstanceType<typeof ExportTugraphQuery>;
      schema: AutoInstanceType<typeof ExportTugraphSchema>;
      subgraph: AutoInstanceType<typeof ExportTugraphSubgraph>;
    }
  }
}
