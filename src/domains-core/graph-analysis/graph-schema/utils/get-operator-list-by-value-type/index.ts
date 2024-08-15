/** 根据数据类型获得比较符选项 */
export const getOperatorListByValueType = (valueType: string = '') => {
  const type = valueType.toLowerCase();

  if (type === 'string') {
    return [
      {
        value: '=',
        label: '=',
      },
      {
        value: '<>',
        label: '≠',
      },
    ];
  }

  if (['int8', 'int16', 'int32', 'int64', 'double', 'date', 'datetime'].includes(type)) {
    return [
      {
        value: '>',
        label: '>',
      },
      {
        value: '<',
        label: '<',
      },
      {
        value: '=',
        label: '=',
      },
      {
        value: '<>',
        label: '≠',
      },
      {
        value: '>=',
        label: '≥',
      },
      {
        value: '<=',
        label: '≤',
      },
    ];
  }

  /* boolean */
  if (type === 'bool') {
    return [
      {
        value: '=',
        label: '=',
      },
      {
        value: '<>',
        label: '≠',
      },
    ];
  }
  return [];
};
