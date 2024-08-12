export const downloadFile = (content: any, filename?: string) => {
  const eleLink = document.createElement('a');
  eleLink.download = filename || 'file';
  eleLink.style.display = 'none';
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eleLink);
  eleLink.click();
  document.body.removeChild(eleLink);
};

export const downloadRemoteFile = (url: string, input?: RequestInit) => {
  return fetch(url, { ...input, credentials: 'include' }).then((res) => {
    return res.blob().then((blob) => {
      // blob用来创建URL的File对象
      const a = document.createElement('a');
      // createObjectURL将一个媒体元素的src属性关联到一个 MediaSource 对象
      const downloadUrl = window.URL.createObjectURL(blob);
      const cd = res.headers.get('Content-disposition') || '';
      const filename = cd.split('=')[1];
      a.href = downloadUrl;
      a.download = decodeURIComponent(filename);
      a.click();
      // revokeObjectURL使这个潜在的对象保留在原来的地方，允许平台在合适的时机进行垃圾收集。
      // window.URL.revokeObjectURL(url);
      return { success: true } as { success: boolean; message: string };
    });
  });
};
