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

export {
  generateNameWithHash
};