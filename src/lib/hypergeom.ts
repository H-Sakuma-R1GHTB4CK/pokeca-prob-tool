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

export const probAllAtLeastOne = (a: number, d: number, targets: number[]): number => {
  if (a < d) {
    return 0;
  }

  if (targets.length === 0) {
    return 0;
  }

  const denominator = combBigInt(a, d);
  if (denominator === 0n) {
    return 0;
  }

  let total = 0;
  const n = targets.length;

  for (let mask = 0; mask < 1 << n; mask += 1) {
    let sum = 0;
    let bits = 0;

    for (let i = 0; i < n; i += 1) {
      if (mask & (1 << i)) {
        sum += targets[i];
        bits += 1;
      }
    }

    const remaining = a - sum;
    const numerator = remaining >= d ? combBigInt(remaining, d) : 0n;
    const term = Number(numerator) / Number(denominator);
    total += bits % 2 === 0 ? term : -term;
  }

  return Math.min(Math.max(total, 0), 1);
};
