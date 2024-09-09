import { PropertyStyleFilter } from '@/domains-core/graph-analysis/graph-schema/components/graph-style-setting';
import { OPERATOR_MAPPING } from '@/domains-core/graph-analysis/graph-schema/constants';

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

  /** 兼容两种形态，否则可能不生效 */
  if (operator === 'EQ' || operator === OPERATOR_MAPPING['EQ']) {
    return properties[propertyName] === formatted;
  } else if (operator === 'NE' || operator === OPERATOR_MAPPING['NE']) {
    return properties[propertyName] !== formatted;
  } else if (operator === 'CT' || operator === OPERATOR_MAPPING['CT']) {
    return `${properties[propertyName]}`.indexOf(`${formatted}`) > -1;
  } else if (operator === 'NC' || operator === OPERATOR_MAPPING['NC']) {
    return `${properties[propertyName]}`.indexOf(`${formatted}`) === -1;
  } else if (operator === 'GT' || operator === OPERATOR_MAPPING['GT']) {
    return Number(properties[propertyName]) > Number(formatted);
  } else if (operator === 'GE' || operator === OPERATOR_MAPPING['GE']) {
    return Number(properties[propertyName]) >= Number(formatted);
  } else if (operator === 'LT' || operator === OPERATOR_MAPPING['LT']) {
    return Number(properties[propertyName]) < Number(formatted);
  } else if (operator === 'LE' || operator === OPERATOR_MAPPING['LE']) {
    return Number(properties[propertyName]) <= Number(formatted);
  }

  return false;
};
