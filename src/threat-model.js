// Scenario rates are illustrative assumptions, not device benchmarks or service facts.
export const SCENARIOS = {
  online: { rate: 10 },
  slow: { rate: 1e4 },
  fast: { rate: 1e10 },
};

export function modelAttack(bits, rate, seconds = 86400) {
  if (
    ![bits, rate, seconds].every(Number.isFinite) ||
    bits < 0 ||
    bits > 4096 ||
    rate < 1 ||
    rate > 1e15 ||
    seconds < 1 ||
    seconds > 3.2e10
  )
    throw new RangeError("Invalid model inputs");
  const logAttempts = Math.log2(Math.floor(rate * seconds));
  return {
    // Uniform exhaustive search without repeat: E[rank] = (N+1)/2.
    log2Seconds: bits - 1 + Math.log2(1 + 2 ** -bits) - Math.log2(rate),
    probability: Math.min(1, 2 ** (logAttempts - bits)),
    log2Probability: Math.min(0, logAttempts - bits),
  };
}
