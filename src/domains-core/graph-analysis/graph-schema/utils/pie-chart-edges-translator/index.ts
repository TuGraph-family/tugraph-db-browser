const PieChartEdgesTranslator = (edges: Record<string, any>) => {
  const num: Record<string, any> = {};
  if (Array.isArray(edges)) {
    edges.forEach((i: Record<string, any>) => {
      if (num[i?.label] || num['other']) {
        num[i?.label] = num[i?.label] + 1;
      } else {
        num[i?.label || 'other'] = 1;
      }
    });
  }

  return Object.keys(num).map((k: string) => ({
    label: k,
    num: num[k],
    ...num[k],
    id: k,
  }));
};
export default PieChartEdgesTranslator;
