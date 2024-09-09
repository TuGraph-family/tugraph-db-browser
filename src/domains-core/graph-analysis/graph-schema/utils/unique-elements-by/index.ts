/** 数组去重 */
export const uniqueElementsBy = (
  arr: any[],
  fn: (arg0: any, arg1: any) => any,
) =>
  arr.reduce((acc, v) => {
    if (!acc.some((x: any) => fn(v, x))) acc.push(v);
    return acc;
  }, []);
