import { PropertyCondition } from '@/domains-core/graph-analysis/graph-schema/interfaces';

export const filterByPropertyCondition = (
  data: Record<string, any>,
  expression: PropertyCondition,
): boolean => {
  const { name, operator, value } = expression || {};
  let formatted: string | number | boolean = value;

  // 原始数据中 boolean 需要转换成字符串比较
  if (typeof data[name] === 'boolean') {
    formatted = value === 'true';
  }

  // 原始数据中是 long 类型时候需要转成数字类型比较
  if (typeof data[name] === 'number') {
    formatted = parseInt(value as string, 10);
  }

  if (operator === 'EQ') {
    return data[name] === formatted;
  } else if (operator === 'NE') {
    return data[name] !== formatted;
  } else if (operator === 'CT') {
    return `${data[name]}`.indexOf(`${formatted}`) > -1;
  } else if (operator === 'NC') {
    return `${data[name]}`.indexOf(`${formatted}`) === -1;
  } else if (operator === 'GT') {
    return Number(data[name]) > Number(formatted);
  } else if (operator === 'GE') {
    return Number(data[name]) >= Number(formatted);
  } else if (operator === 'LT') {
    return Number(data[name]) < Number(formatted);
  } else if (operator === 'LE') {
    return Number(data[name]) <= Number(formatted);
  }

  return false;
};
