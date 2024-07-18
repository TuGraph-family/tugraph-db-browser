import { includes } from 'lodash';
import { CONNECT, CONNECT_STR_TYPE } from '@/components/studio/constant';
export const getConnectOptions = (type: string) => {
  if (includes(CONNECT_STR_TYPE, type)) {
    return CONNECT['string'];
  }
  return CONNECT['number'];
};
