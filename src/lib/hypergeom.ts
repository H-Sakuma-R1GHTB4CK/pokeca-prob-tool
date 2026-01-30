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

type TargetNeed = {
  count: number;
  need: number;
};

export const probAtLeastTargets = (a: number, d: number, targets: TargetNeed[]): number => {
  if (a < d) {
    return 0;
  }

  if (targets.length === 0) {
    return 0;
  }

  if (targets.some((t) => t.need > t.count)) {
    return 0;
  }

  const minNeeded = targets.reduce((sum, t) => sum + t.need, 0);
  if (d < minNeeded) {
    return 0;
  }

  const totalTargets = targets.reduce((sum, t) => sum + t.count, 0);
  if (totalTargets > a) {
    return 0;
  }

  const rest = a - totalTargets;
  const denominator = combBigInt(a, d);
  if (denominator === 0n) {
    return 0;
  }

  const dp: bigint[] = Array(d + 1).fill(0n);
  dp[0] = 1n;

  targets.forEach((target) => {
    const next: bigint[] = Array(d + 1).fill(0n);
    const maxPick = Math.min(target.count, d);

    for (let picked = 0; picked <= d; picked += 1) {
      if (dp[picked] === 0n) {
        continue;
      }
      for (let x = target.need; x <= maxPick && picked + x <= d; x += 1) {
        next[picked + x] += dp[picked] * combBigInt(target.count, x);
      }
    }

    for (let i = 0; i <= d; i += 1) {
      dp[i] = next[i];
    }
  });

  let numerator = 0n;
  for (let picked = 0; picked <= d; picked += 1) {
    if (dp[picked] === 0n) {
      continue;
    }
    const remaining = d - picked;
    const ways = remaining <= rest ? combBigInt(rest, remaining) : 0n;
    numerator += dp[picked] * ways;
  }

  const value = Number(numerator) / Number(denominator);
  return Math.min(Math.max(value, 0), 1);
};
