/**
 * file: common call
 * author: Allen
*/

/** 生成prefix_4位hash的格式命名，用于解决命名冲突 */
const generateNameWithHash = (prefix: string) => {

  const generateHash = () => {
    return Math.random().toString(16).substring(2, 6).toUpperCase();
  };

  const hash = generateHash();
  return `${prefix}_${hash}`;
}

/** generate random ID with 36 */
const getId = () => Math.random().toString(36).slice(2);

/** transform color from hex to rgb */
const transformHexToRgb = (hex?: string, alpha?: number) => {
  if (!hex?.startsWith('#')) {
    return hex;
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b}, ${alpha || 1})`;
};

export {
  generateNameWithHash,
  getId,
  transformHexToRgb
};
