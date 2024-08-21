import { PropertyCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import moment from 'moment';

export const filterByPropertyCondition = (
  data: Record<string, any>,
  expression: PropertyCondition,
): boolean => {
  const { name, operator, value } = expression || {};
  let formatted: string | number | boolean = value;
  let content = data[name];

  /* 时间格式判断 */
  const regex = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/;


  // 原始数据中 boolean 需要转换成字符串比较
  if (typeof content === 'boolean') {
    formatted = value === 'true';
  }

  // 原始数据中是 long 类型时候需要转成数字类型比较
  if (typeof content === 'number') {
    formatted = parseInt(value as string, 10);
  }

   // 原始数据是 date 类型时候转成时间戳
   if(regex.test(content)){
    content = moment(content).valueOf();
  }

  /* 用户输入是时间格式装成时间戳进行比较 */
  if(typeof formatted === 'string' && regex.test(formatted)){
    formatted = moment(formatted).valueOf();
  }


  

  switch (true) {
    case operator === '=':
      return content === formatted;
    case operator === '<>':
      return content !== formatted;
    case operator === '⊃':
      return `${content}`.indexOf(`${formatted}`) > -1;
    case operator === '⊅':
      return `${content}`.indexOf(`${formatted}`) === -1;
    case operator === '>':
      return Number(content) > Number(formatted);
    case operator === '>=':
      return Number(content) >= Number(formatted);
    case operator === '<':
      return Number(content) < Number(formatted);
    case operator === '<=':
      return Number(content) <= Number(formatted);
    default:
      return false;
  }
};
