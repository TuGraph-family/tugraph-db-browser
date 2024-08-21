import { PropertyCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';
import moment from 'moment';

export const filterByPropertyCondition = (
  data: Record<string, any>,
  expression: PropertyCondition,
): boolean => {
  const { name, operator, value } = expression || {};
  let formatted: string | number | boolean = value;
  
  /* 时间格式判断 */
  const regex = /^(\d{4})-(\d{2})-(\d{2})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/;
  const isDate = regex.test(formatted as string) && regex.test(data[name]);

  // 原始数据中 boolean 需要转换成字符串比较
  if (typeof data[name] === 'boolean') {
    formatted = value === 'true';
  }

  // 原始数据中是 long 类型时候需要转成数字类型比较
  if (typeof data[name] === 'number') {
    formatted = parseInt(value as string, 10);
  }

  switch (true) {
    case operator === '=':
      return data[name] === formatted;
    case operator === '<>':
      return data[name] !== formatted;
    case operator === '⊃':
      return `${data[name]}`.indexOf(`${formatted}`) > -1;
    case operator === '⊅':
      return `${data[name]}`.indexOf(`${formatted}`) === -1;
    case operator === '>' && isDate:
      return moment(formatted as string)?.isBefore(moment(data[name]));
    case operator === '>':
      return Number(data[name]) > Number(formatted);
    case operator === '>=' && isDate:
      return moment(formatted as string)?.isSameOrBefore(moment(data[name]));
    case operator === '>=':
      return Number(data[name]) >= Number(formatted);
    case operator === '<' && isDate:
      return moment(formatted as string)?.isAfter(moment(data[name]));
    case operator === '<':
      return Number(data[name]) < Number(formatted);
    case operator === '<=' && isDate:
      return moment(formatted as string)?.isSameOrAfter(moment(data[name]));
    case operator === '<=':
      return Number(data[name]) <= Number(formatted);
    default:
      return false;
  }
};
