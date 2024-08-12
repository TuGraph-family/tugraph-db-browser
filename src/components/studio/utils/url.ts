import queryString from 'query-string';

// 改路由参数
export function addQueryParam(key: string, value: string) {
  const location = window.location;
  const hashList = location.hash?.split('?');
  const query = queryString.parse((hashList?.[1] || '')?.trim());

  query[key] = value;
  location.hash = `${hashList[0]}?${queryString.stringify(query)}`;
}

export function getQueryParam(key: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}
