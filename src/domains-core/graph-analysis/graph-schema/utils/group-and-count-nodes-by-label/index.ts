const groupAndCountNodesByLabel = ({
  nodes,
  typeMap,
}: Record<string, any>): Record<string, any>[] => {
  const result: Record<string, any>[] = [];
  const keys: string[] = [];
  const num: Record<string, any> = {};
  nodes.forEach((i: Record<string, any>) => {
    if (num[i?.label]) {
      num[i?.label] = num[i?.label] + 1;
    } else {
      num[i?.label] = 1;
    }
  });
  nodes.forEach((item: Record<string, any>) => {
    if (keys.includes(item?.label)) {
      if (typeMap[item?.label]) {
        if (Array.isArray(typeMap[item?.label])) {
          typeMap[item?.label].push(item?.id);
        }
      } else {
        typeMap[item?.label] = [item?.id];
      }
    } else {
      typeMap[item?.label] = [item?.id];
      keys.push(item?.label);
      result.push({
        ...item,
        num: num[item?.label] || 0,
      });
    }
  });

  return result;
};

export default groupAndCountNodesByLabel;
