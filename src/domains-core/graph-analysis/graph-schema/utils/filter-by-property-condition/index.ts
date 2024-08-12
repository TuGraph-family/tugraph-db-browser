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

  if (operator === '=') {
    return data[name] === formatted;
  } else if (operator === '≠') {
    return data[name] !== formatted;
  } else if (operator === '⊃') {
    return `${data[name]}`.indexOf(`${formatted}`) > -1;
  } else if (operator === '⊅') {
    return `${data[name]}`.indexOf(`${formatted}`) === -1;
  } else if (operator === '>') {
    return Number(data[name]) > Number(formatted);
  } else if (operator === '≥') {
    return Number(data[name]) >= Number(formatted);
  } else if (operator === '<') {
    return Number(data[name]) < Number(formatted);
  } else if (operator === '≤') {
    return Number(data[name]) <= Number(formatted);
  }

  return false;
};
