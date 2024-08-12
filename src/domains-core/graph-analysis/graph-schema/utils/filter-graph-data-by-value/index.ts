/** 根据值筛选画布数据 */
export const filterGraphDataByValue = (
  value: string,
  arr: Record<string, any>[],
  parentKey = '',
) => {
  const result: Record<string, any>[] = [];
  arr.forEach((obj) => {
    for (let key in obj) {
      if (typeof obj[key] === 'object') {
        let innerResult = filterGraphDataByValue(value, [obj[key]], key);
        if (innerResult.length > 0) {
          result.push({
            id: obj.id,
            key: innerResult[0].key,
            value: obj,
          });
          break;
        }
      } else if (
        typeof obj[key] === 'string' &&
        obj[key].includes(value) &&
        key !== 'color'
      ) {
        let fullKey = parentKey ? `${parentKey}.${key}` : key;
        result.push({
          id: obj.id,
          key: fullKey,
          value: obj,
        });
        break;
      }
    }
  });
  return result;
};
