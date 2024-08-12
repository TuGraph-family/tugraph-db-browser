export const getFileSizeTransform = (size: number) => {
  let fileSize;
  if (size / 1024 < 1) {
    fileSize = `${size} B`;
  }
  if (size / 1024 >= 1 && size / 1024 ** 2 < 1) {
    fileSize = `${(size / 1024).toFixed(2)} KB`;
  }
  if (size / 1024 ** 2 >= 1 && size / 1024 ** 3 < 1) {
    fileSize = `${(size / 1024 ** 2).toFixed(2)} MB`;
  }
  if (size / 1024 ** 3 >= 1) {
    fileSize = `${(size / 1024 ** 3).toFixed(2)} GB`;
  }
  return fileSize || '';
};
