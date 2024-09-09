import queryString from 'query-string';

export const parseSearch = (search: string) =>
  queryString.parse(search?.trim().replace(/^[?]+/g, '')) as any;
