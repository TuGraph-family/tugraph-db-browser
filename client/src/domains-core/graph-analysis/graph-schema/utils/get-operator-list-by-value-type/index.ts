/** 根据数据类型获得比较符选项 */
export const getOperatorListByValueType = (valueType: string = '') => {
  const type = valueType.toLowerCase();

  if (type === 'string') {
    return [
      {
        value: 'CT',
        label: '⊃',
        text: '包含',
      },
      {
        value: 'NC',
        label: '⊅',
        text: '不包含',
      },
      {
        value: 'EQ',
        label: '=',
      },
      {
        value: 'NE',
        label: '≠',
      },
    ];
  }

  if (type === 'long' || type === 'double' || type === 'int32') {
    return [
      {
        value: 'GT',
        label: '>',
      },
      {
        value: 'LT',
        label: '<',
      },
      {
        value: 'EQ',
        label: '=',
      },
      {
        value: 'NE',
        label: '≠',
      },
      {
        value: 'GE',
        label: '≥',
      },
      {
        value: 'LE',
        label: '≤',
      },
    ];
  }

  if (type === 'boolean') {
    return [
      {
        value: 'EQ',
        label: '=',
      },
      {
        value: 'NE',
        label: '≠',
      },
    ];
  }
  return [];
};
