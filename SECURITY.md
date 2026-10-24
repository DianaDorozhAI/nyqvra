# Security policy

NYQVRA 0.3.0 is an early Windows preview alongside the web application. No independent security audit has been performed. Automated tests and browser QA are not certification.

## Report a vulnerability

Use [GitHub private vulnerability reporting](https://github.com/DianaDorozhAI/nyqvra/security/advisories/new). Do not put real passwords, account details, secrets or exploitable private data in a public issue.

Include version/commit, browser and OS, reproduction with dummy data, expected behavior and impact. Response times are not guaranteed; a report is not confirmation of a fix.

Biased generation, incorrect constrained entropy, invalid strength labels, disclosure of generated output, unsafe packaging or malicious dependencies are in scope. Do not test against real accounts or third-party services.

## Boundaries

- Web Crypto is the only password/passphrase randomness source. There is no insecure fallback.
- Whole-candidate rejection preserves uniform selection when each selected class is required.
- The model assumes independent uniform choices and exhaustive guessing without repetition. Rates are illustrative, not measured hardware/service speeds.
- The web application and browser offline ZIP do not store results. There is no breach service or human-password analyzer.
- The Windows app offers an optional journal: only explicitly saved entries are persisted, encrypted with Electron safeStorage for the current Windows account. Labels, URLs, dates and secrets are encrypted together. No plaintext fallback is allowed.
- Windows-account encryption does not provide a separate master-password lock and does not protect against malware running as the same user. There is no cloud sync, export or account/device recovery. Uninstallation preserves journal data; use the journal's delete controls to remove entries. Secure deletion from disk/backups is not guaranteed.
- The desktop renderer is sandboxed and isolated, loads an explicit bundled resource inventory, blocks network requests and exposes only narrow journal/clipboard actions. These controls do not eliminate implementation or supply-chain risks.
- The Windows preview installer is unsigned and has not completed install/uninstall testing across Windows configurations. Do not disable platform protections. The host may log ordinary website page/resource requests.
- Extensions, malware, compromised delivery, clipboard readers/history/sync and process memory remain risks. Secure memory erasure is not guaranteed.
- CSP is defense in depth, not protection against a host replacing application code.

Download from the author's official repository/releases. A hash detects changed bytes against a trusted reference; it does not prove that a program is safe. A fork can differ from the official version.

See [calculation details](docs/SECURITY-MODEL.md). Generated passphrases are not cryptocurrency wallet seeds.
