export const batchSecureDeletion = (obj: any, delKeys: string[]) => {
  if (Array.isArray(delKeys) && delKeys?.length) {
    return delKeys.every(key => {
      if (new Object(obj).hasOwnProperty(key)) {
        delete obj[key];
        return true;
      } else {
        return false;
      }
    });
  }
  return false;
};
