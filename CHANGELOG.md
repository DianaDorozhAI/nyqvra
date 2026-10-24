# Changelog

## 0.3.0 — Windows preview and encrypted journal

- Windows x64 setup wizard in Russian and English, with the existing NYQVRA logo as the application icon.
- Optional explicit saving with an account label, comment or URL; a separate Journal view with dates, masked values, reveal, copy and delete.
- Windows-account encryption for the complete local journal, including metadata; no plaintext fallback, synchronization or automatic generation history.
- Sandboxed desktop renderer, restricted local resource inventory and external links, serialized storage operations and packaged-app hardening.
- Journal data remains after uninstallation. No master-password recovery or portable backup is provided.
- 24 automated tests, desktop smoke coverage and a Windows installer CI workflow.
- Original visual identity and web/offline browser behavior retained. The web app has no persistent journal.

Preview limitations: unsigned installer; no independent security audit; installation/uninstallation across Windows configurations is not yet fully verified.

## 0.2.1 — MIT license and product case study

- Adopted the MIT License for original project materials; preserved separate third-party terms.
- Included LICENSE in offline downloads and integrity checks.
- Expanded the Russian and English product case studies: problem, audience, decisions, journey and validation.
- Replaced implementation-focused README prose with a product overview.
- Restored the original armor image for wide-screen foregrounds and adjusted its crop; generation logic is unchanged.

## 0.2.0 — initial public preview

- Password generation: 8–128 characters, selectable classes, optional presence of each selected class.
- Passphrases: 4–10 words from the embedded EFF Large Wordlist.
- Generated-output ratings with three guessing scenarios.
- RU/EN, icon-only copy/show actions, draft settings preserved until regeneration.
- Smoky-lilac glass UI, chamfered panel/dialogs, static knight and blurred background continuation.
- Animated brand knot respecting reduced motion.
- Offline ZIP, SHA-256 checksums, Node.js tests and CI.
- GitHub Pages site and source repository.

Not a Windows installer, password manager, independent security audit or account-security guarantee. At the initial 0.2.0 release an open-source license had not yet been selected; MIT was adopted in 0.2.1.
