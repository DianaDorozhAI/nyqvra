# Build and tests / Сборка и тесты

## English

Use Node.js 22 or 24. The web build requires no npm dependencies or server framework. Windows dependencies are separately locked in `desktop/`.

```sh
git clone https://github.com/DianaDorozhAI/nyqvra.git
cd nyqvra
npm run build
npm test
npm run dev
```

Open `http://127.0.0.1:4173/`. `npm run preview` serves `dist/`. `npm run package` produces the offline ZIP and SHA-256 checksum in `outputs/`, using an explicit inventory rather than sweeping the working directory.

Tests cover random-index rejection, character pools, required classes, entropy, guessing scenarios, settings, EFF list integrity, server restrictions, build/ZIP contents, license inclusion and checksums. CI runs on Windows/Linux with Node.js 22/24. Statistical appearance is not used as proof of cryptographic security.

| File | Responsibility |
| --- | --- |
| `src/password.js` | Generation and entropy |
| `src/threat-model.js` | Guessing scenarios |
| `src/settings.js` | Draft settings validation |
| `src/main.js` | State, actions, RU/EN |
| `src/engineering.css` | Responsive interface |
| `src/engineering-effects.js` | Brand animation, separate from generation |
| `scripts/runtime-files.mjs` | Public runtime inventory |
| `scripts/package.mjs` | Deterministic ZIP with the same toolchain |
| `test/` | Regression tests |

The wordlist is already bundled. The optional import script expects the original EFF list at `work/eff_large_wordlist.txt`; its source and terms are in THIRD_PARTY_NOTICES.md. It is not needed to build or run the app.

## Русский

Нужен Node.js 22 или 24; для веб-сборки зависимости npm не требуются. Windows-зависимости отдельно зафиксированы в `desktop/`. Команды выше: сборка, тесты, затем локальный сервер. Адрес — `http://127.0.0.1:4173/`.

- `npm run preview` — запуск готовой папки `dist/`.
- `npm run package` — офлайн-архив и контрольная сумма в `outputs/`.
- `npm test` — регрессионные проверки. В архив входят только файлы явного списка, LICENSE, инструкция и уведомления.

Список EFF уже включён в исходники. Необязательный скрипт импорта требует оригинальный файл `work/eff_large_wordlist.txt`; для обычной сборки он не нужен. Условия сторонних материалов — в THIRD_PARTY_NOTICES.md.

## Windows desktop / Настольное приложение

Run on Windows x64 / Выполняйте на Windows x64:

```sh
npm --prefix desktop ci
npm test
npm run desktop:test
npm run desktop:package
```

The installer is written to `outputs/windows/`. Preparation copies an explicit runtime inventory and derives the icon from the existing SVG logo. Preview and smoke scripts are excluded from the packaged app. Signing requires a separate publisher certificate; no signing credentials are stored in this repository.

Установщик появляется в `outputs/windows/`. Подготовка копирует только явный список ресурсов и создаёт иконку из существующего SVG-логотипа. Демо- и тестовые скрипты в приложение не входят. Для цифровой подписи нужен отдельный сертификат издателя; учётных данных подписи в репозитории нет.

The optional encrypted journal is `journal.enc` under Electron's Windows user-data directory (normally `%APPDATA%/nyqvra-desktop/`). Tests and previews use isolated generated profiles under ignored `work/`, with fictional data only. Never commit a real profile or journal.

Журнал `journal.enc` расположен в каталоге пользовательских данных приложения (обычно `%APPDATA%/nyqvra-desktop/`). Тесты и демо используют отдельные профили в игнорируемой папке `work/` и только вымышленные записи. Реальные профили и журналы не должны попадать в Git.
