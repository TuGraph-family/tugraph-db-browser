import { filter, includes } from 'lodash';
import { TUGRAPH_DEOM_NAME } from '../constant';
export const getDefaultDemoList = (list) => {
  return [
    ...filter(list, (item) => includes(TUGRAPH_DEOM_NAME, item.graphName)),
    ...filter(list, (item) => !includes(TUGRAPH_DEOM_NAME, item.graphName)),
  ];
};
