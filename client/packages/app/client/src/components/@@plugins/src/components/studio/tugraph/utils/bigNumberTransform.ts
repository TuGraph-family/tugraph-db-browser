export const bigNumberTransform = (value: number | undefined) => {
  if (!value) {
    return "";
  }
  let numberValue;
  let unit: string = "";
  let minNumber: number = 10000;
  let sizes: string[] = ["", "万", "亿", "万亿"];
  let i: number;
  if (value < minNumber) {
    numberValue = value;
  } else {
    i = Math.floor(Math.log(value) / Math.log(minNumber));
    numberValue = (value / Math.pow(minNumber, i)).toFixed(2);
    unit = sizes[i];
  }
  return numberValue + unit;
};
