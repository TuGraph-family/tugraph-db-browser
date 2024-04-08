export function addQueryParam(key: string, value: string) {
  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams(url.search);

  if (searchParams.has(key)) {
    searchParams.set(key, value);
  } else {
    searchParams.append(key, value);
  }

  url.search = searchParams.toString();
  window.history.replaceState({ path: url.href }, '', url.href);
}

export function getQueryParam(key: string) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(key);
}
