const transformNaN = (val: number | string): number => {
  const value = Number(val);
  return isNaN(value) ? 0 : value;
};

export { transformNaN };
