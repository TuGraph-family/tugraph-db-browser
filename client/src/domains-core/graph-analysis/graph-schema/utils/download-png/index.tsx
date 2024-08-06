import { Graph } from '@antv/g6';

export const downloadFullImage = async (graph: Graph) => {
  if (!graph) return;
  const dataURL = await graph.toDataURL();
  const [head, content] = dataURL.split(',');
  const contentType = head.match(/:(.*?);/)![1];
  const bstr = atob(content);
  let length = bstr.length;
  const u8arr = new Uint8Array(length);

  while (length--) {
    u8arr[length] = bstr.charCodeAt(length);
  }

  const blob = new Blob([u8arr], { type: contentType });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'graph.png';
  a.click();
};
