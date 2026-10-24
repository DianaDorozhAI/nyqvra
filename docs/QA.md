# Release verification — 0.3.0

## Automated checks

24 Node.js tests pass locally. Coverage includes generation, unbiased index selection, constrained entropy, settings, passphrases, guessing models, server restrictions, explicit build/ZIP inventories and checksums, desktop URL/resource policy, encrypted journal persistence, metadata validation, deletion and fail-closed behavior. CI runs the suite on Windows/Linux with Node.js 22/24; workflow results are the authoritative current status.

The Windows desktop smoke test passes locally with real Windows safeStorage encryption. It verifies:

- generator behavior, loaded assets and RU/EN switching;
- renderer isolation and blocking remote requests and unlisted resources;
- saving a hidden result through the actual dialog and displaying a masked journal entry;
- save/list/reveal/copy/delete IPC actions;
- absence of the known dummy secret in the encrypted file;
- clipboard actions using dummy markers only.

Unit tests separately reopen an encrypted fixture and confirm unreadable data is not overwritten. Their encryption adapter is test-only; the application uses Windows safeStorage.

## Packaging and screenshots

The Windows x64 NSIS installer builds successfully with the existing NYQVRA logo, RU/EN setup selection and hardened packaged Electron runtime. The installer wizard launches locally. Setup is unsigned; Windows may warn.

The generator and journal screenshots in `docs/images/nyqvra-windows-*.png` were captured from the local desktop preview. Journal entries are explicitly marked as fictional demos, using example.com/example.org. Preview/test scripts and profiles are excluded from the packaged application.

The browser offline ZIP includes only the declared runtime, instructions, license, notices and checksum manifest. The web runtime contains no desktop journal.

## Verification limits

Installation, upgrades and uninstallation across Windows configurations have not completed a full verification matrix. There is no code-signing certificate, independent security audit, tested portable recovery, synchronization or master-password lock. Tests do not establish protection against malware running as the current user.

Previous browser checks covered desktop, tablet and narrow layouts, long outputs, copy/hide actions and settings preservation. They do not constitute a fresh cross-browser matrix for this release. Browser file launch remains dependent on browser clipboard restrictions.

## Русский

Локально прошли 24 теста и отдельная проверка настольного приложения с настоящим шифрованием Windows. Проверены генерация, RU/EN, сохранение скрытого результата через диалог, маскирование, показ, копирование и удаление, ограничения ресурсов и отсутствие тестового секрета в открытом виде в файле журнала.

Установщик x64 собран; мастер установки запускается. Скриншоты содержат только вымышленные демозаписи. Полная матрица установки, обновления и удаления ещё не проверена. Цифровой подписи и независимого аудита нет. Веб-версия и браузерный ZIP не сохраняют результаты.
