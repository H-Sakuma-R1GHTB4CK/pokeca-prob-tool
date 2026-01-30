export const formatPercent = (value: number, digits = 2) => {
  return `${(value * 100).toFixed(digits)}%`;
};

export const formatPercentInt = (value: number) => {
  return Math.round(value * 100);
};
