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
        /** 需要支持 number 和 string 都能查询，把统一转成字符来匹配 */
        (typeof obj[key] === 'string' || typeof obj[key] === 'number') &&
        obj[key].toString().includes(value) &&
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
