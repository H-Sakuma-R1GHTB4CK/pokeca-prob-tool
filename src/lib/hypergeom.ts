const toBigInt = (value: number) => BigInt(Math.trunc(value));

export const combBigInt = (n: number, k: number): bigint => {
  if (k < 0 || k > n) {
    return 0n;
  }

  const kk = Math.min(k, n - k);
  let result = 1n;

  for (let i = 1; i <= kk; i += 1) {
    result = (result * toBigInt(n - kk + i)) / toBigInt(i);
  }

  return result;
};

export const pmf = (a: number, t: number, d: number, k: number): number => {
  if (a < d) {
    return 0;
  }

  if (k < 0 || k > t || k > d) {
    return 0;
  }

  if (d - k > a - t) {
    return 0;
  }

  const numerator = combBigInt(t, k) * combBigInt(a - t, d - k);
  const denominator = combBigInt(a, d);

  return Number(numerator) / Number(denominator);
};

export const atLeast = (a: number, t: number, d: number, m: number): number => {
  const maxK = Math.min(t, d);

  if (m > maxK) {
    return 0;
  }

  let sum = 0;

  for (let k = Math.max(0, m); k <= maxK; k += 1) {
    sum += pmf(a, t, d, k);
  }

  return sum;
};
