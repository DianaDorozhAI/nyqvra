export const CHARSETS = {
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lower: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{}:,.?",
};

export function getPool(options) {
  return Object.entries(options)
    .filter(([name, enabled]) => enabled && CHARSETS[name])
    .map(([name]) => CHARSETS[name])
    .join("");
}

export function randomIndex(max, cryptoApi = globalThis.crypto) {
  if (!Number.isInteger(max) || max < 1 || max > 65536)
    throw new RangeError("max must be an integer from 1 to 65536");
  const range = max <= 256 ? 256 : 65536;
  const limit = range - (range % max);
  const bytes = max <= 256 ? new Uint8Array(1) : new Uint16Array(1);
  do {
    cryptoApi.getRandomValues(bytes);
  } while (bytes[0] >= limit);
  return bytes[0] % max;
}

export function generatePassword(
  length,
  pool,
  cryptoApi = globalThis.crypto,
  requiredSets = [],
) {
  if (!Number.isInteger(length) || length < 1)
    throw new RangeError("length must be a positive integer");
  if (!pool.length) throw new Error("Choose at least one character type");
  if (
    requiredSets.length > length ||
    requiredSets.some(
      (set) => !set.length || [...set].some((c) => !pool.includes(c)),
    )
  )
    throw new RangeError("Invalid required sets");
  // Reject whole candidates, preserving a uniform distribution over valid strings.
  // Never insert forced characters into an otherwise random candidate.
  for (let attempt = 0; attempt < 4096; attempt++) {
    const result = Array.from(
      { length },
      () => pool[randomIndex(pool.length, cryptoApi)],
    ).join("");
    if (requiredSets.every((set) => [...result].some((c) => set.includes(c))))
      return result;
  }
  throw new Error("Random source did not produce an acceptable candidate");
}

export function entropyBits(length, poolSize) {
  return length * Math.log2(poolSize);
}

export function constrainedEntropy(length, poolSize, sizes = []) {
  // Inclusion–exclusion for disjoint character classes. Selection is uniform.
  let probability = 0;
  for (let mask = 0; mask < 2 ** sizes.length; mask++) {
    let removed = 0;
    let count = 0;
    sizes.forEach((size, i) => {
      if (mask & (1 << i)) {
        removed += size;
        count++;
      }
    });
    probability +=
      (count % 2 ? -1 : 1) * ((poolSize - removed) / poolSize) ** length;
  }
  return entropyBits(length, poolSize) + Math.log2(probability);
}

export function generatePassphrase(
  count,
  words,
  cryptoApi = globalThis.crypto,
) {
  if (
    !Number.isInteger(count) ||
    count < 4 ||
    count > 10 ||
    new Set(words).size !== words.length ||
    words.length < 1000
  )
    throw new RangeError("Invalid passphrase settings");
  return Array.from(
    { length: count },
    () => words[randomIndex(words.length, cryptoApi)],
  ).join(" ");
}

