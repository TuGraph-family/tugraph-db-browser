import { PropertyStyleFilter } from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';

export const filterElementByPropertyValue = (
  properties: any,
  propertyStyleFilter: PropertyStyleFilter,
): boolean => {
  const { propertyName, operator, propertyValue } = propertyStyleFilter;
  let formatted: string | number | boolean = propertyValue;

  // 原始数据中 boolean 需要转换成字符串比较
  if (typeof properties[propertyName] === 'boolean') {
    formatted = propertyValue === 'true';
  }

  // 原始数据中是 long 类型时候需要转成数字类型比较
  if (typeof properties[propertyName] === 'number') {
    formatted = parseInt(propertyValue as string, 10);
  }

  if (operator === 'EQ') {
    return properties[propertyName] === formatted;
  } else if (operator === 'NE') {
    return properties[propertyName] !== formatted;
  } else if (operator === 'CT') {
    return `${properties[propertyName]}`.indexOf(`${formatted}`) > -1;
  } else if (operator === 'NC') {
    return `${properties[propertyName]}`.indexOf(`${formatted}`) === -1;
  } else if (operator === 'GT') {
    return Number(properties[propertyName]) > Number(formatted);
  } else if (operator === 'GE') {
    return Number(properties[propertyName]) >= Number(formatted);
  } else if (operator === 'LT') {
    return Number(properties[propertyName]) < Number(formatted);
  } else if (operator === 'LE') {
    return Number(properties[propertyName]) <= Number(formatted);
  }

  return false;
};
