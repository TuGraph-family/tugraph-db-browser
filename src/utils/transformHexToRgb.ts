export const tranformHexToRgb = (hex?: string, alpha?: number) => {
  if (!hex?.startsWith('#')) {
    return hex;
  }

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b}, ${alpha || 1})`;
};
