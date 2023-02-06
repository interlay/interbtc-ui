const convertExponentialToNormal = (exponentialNumber: number | string): string => {
  const normalNumber = parseFloat(exponentialNumber.toString()).toFixed(20);
  return normalNumber.replace(/0+$/, '').replace(/\.$/, '');
};

export { convertExponentialToNormal };
