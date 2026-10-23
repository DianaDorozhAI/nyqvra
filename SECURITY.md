# Security policy

NYQVRA 0.2.x is an early release. No independent security audit has been performed. Automated tests and browser QA are not certification.

## Report a vulnerability

Use [GitHub private vulnerability reporting](https://github.com/DianaDorozhAI/nyqvra/security/advisories/new). Do not put real passwords, account details, secrets or exploitable private data in a public issue.

Include version/commit, browser and OS, reproduction with dummy data, expected behavior and impact. Response times are not guaranteed; a report is not confirmation of a fix.

Biased generation, incorrect constrained entropy, invalid strength labels, disclosure of generated output, unsafe packaging or malicious dependencies are in scope. Do not test against real accounts or third-party services.

## Boundaries

- Web Crypto is the only password/passphrase randomness source. There is no insecure fallback.
- Whole-candidate rejection preserves uniform selection when each selected class is required.
- The model assumes independent uniform choices and exhaustive guessing without repetition. Rates are illustrative, not measured hardware/service speeds.
- No vault, history, breach service or human-password analyzer is implemented.
- Passwords are not sent or persistently stored by the application. The host may log ordinary page/resource requests.
- Extensions, malware, compromised delivery, clipboard readers/history/sync and process memory remain risks. Secure memory erasure is not guaranteed.
- CSP is defense in depth, not protection against a host replacing application code.

Download from the author's official repository/releases. A hash detects changed bytes against a trusted reference; it does not prove that a program is safe. A fork can differ from the official version.

See [calculation details](docs/SECURITY-MODEL.md). Generated passphrases are not cryptocurrency wallet seeds.
