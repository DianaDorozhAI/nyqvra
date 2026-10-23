# Calculation method

[Русский](SECURITY-MODEL.md) · **English**

The model applies only to NYQVRA-generated outputs, not human-chosen passwords. Equal length does not imply equal predictability.

## Uniform generation

All allowed symbols have equal selection probability. Web Crypto supplies random values; rejection sampling discards values outside the largest complete multiple range before modulo reduction. Symbol selection uses 8-bit values; the 7,776-word EFF list uses 16-bit values. No `Math.random()` fallback exists.

Without required classes: `H = L × log2(N)` bits, with length L and pool size N. With required disjoint classes, inclusion–exclusion counts valid strings. Whole invalid candidates are rejected; characters are not forcibly inserted.

For K words: `H = K × log2(7776)`. Choices are independent and repetitions are allowed. Fixed spaces add no entropy; internal word hyphens are preserved.

## Exhaustive guessing

Let `M = 2^H`, checking speed r guesses/s and period t seconds. For uniform outputs and guessing without repetition:

- Mean guesses: `(M + 1) / 2`.
- Mean time: `(M + 1) / (2 × r)`.
- Finding probability: `min(floor(r × t) / M, 1)`.

Log-domain calculations improve numerical stability for large numbers. The UI does not present astronomical durations as predictions.

| Scenario | Illustrative rate |
| --- | ---: |
| Login form | 10 guesses/s |
| Slow offline checking after a leak | 10,000 guesses/s |
| Fast offline checking after a leak | 10,000,000,000 guesses/s |

These are not measured rates for any service, hash algorithm or device. Lockouts and MFA are not modeled.

Each row compares finding probability over **86,400 seconds**:

- High: `p < 10^-12`.
- Moderate: `p < 10^-6` if the high threshold is not met.
- Low: otherwise.

The headline uses the fastest scenario. Eight digits are weak, while 24 characters from the full pool are strong under these assumptions. Thresholds are editorial UI choices, not an industry standard or certification.

Phishing, malware, reuse, theft of the password itself, extensions, service bugs, memory and clipboard disclosure are outside the model. NYQVRA does not test or attack accounts/services. No independent audit has been performed.
