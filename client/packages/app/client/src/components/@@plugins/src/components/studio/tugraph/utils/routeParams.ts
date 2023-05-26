import queryString from 'query-string';
export const parseSearch = (search: string) =>
  queryString.parse(search?.trim().replace(/^[?]+/g, ''));
export const searchFy = <P extends object>(params: P) =>
  `${location.pathname.replace('/v4', '')}?${queryString.stringify(params)}`;
export const getQueryString = (name: string) => {
  const reg = new RegExp('(^|&|\\?)' + name + '=([^(&|#)]*)', 'i');
  const r = location.href.match(reg);
  if (r !== null) {
    return decodeURIComponent(r[2]);
  }
  return '';
};
