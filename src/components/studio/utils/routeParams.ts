/**
 * file: handle url string
 * author: Allen
*/

import queryString from 'query-string';

/**
 * parse search string
 * @param search Search string
 * @returns Parsed object
 */
export const parseSearch = (search: string) => {
  return queryString.parse(search?.trim().replace(/^[?]+/g, ''));
};

/**
 * generate search str
 * @param params Obj
 * @returns Formatted string
 */
export const searchFy = <P extends Record<string, unknown>>(params: P): string => {
  const path = location.pathname.replace('/v4', '');
  const query = queryString.stringify(params);
  return `${path}?${query}`;
};

/**
 * Get the value of a specified parameter from the URL
 * @param name String
 * @returns String
 */
export const getQueryString = (name: string) => {
  const reg = new RegExp(`(^|&|\\?)${name}=([^(&|#)]*)`, 'i');
  const match = location.href.match(reg);
  if (match) {
    return decodeURIComponent(match[2]);
  }
  return '';
};
