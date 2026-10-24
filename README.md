# NYQVRA

**English** · [Русский](README.ru.md)

Generate random passwords and passphrases locally. Understand their resistance to guessing without an account or sending the result to a server.

**[Open NYQVRA](https://dianadorozhai.github.io/nyqvra/)** · **[Windows & offline downloads](https://github.com/DianaDorozhAI/nyqvra/releases/tag/v0.3.0)** · [Product case study](docs/CASE-STUDY.en.md)

![Checks](https://github.com/DianaDorozhAI/nyqvra/actions/workflows/ci.yml/badge.svg)

![NYQVRA Windows generator](docs/images/nyqvra-windows-generator.png)

## What it does

- Generates passwords of **8–128 characters** with selectable letters, digits and symbols.
- Creates passphrases of **4–10 English words** from the EFF Large Wordlist.
- Shows a clear strength label and explains it under **three guessing scenarios**.
- Keeps the current result while you adjust settings; replaces it only when you generate again.
- Offers copy/show controls and a **Russian/English** interface.

NYQVRA connects generation to an explanation of what the settings change. It is a focused generator, not a password manager, breach-checking service or guarantee of account security.

## Use it

### Website

[Open the app](https://dianadorozhai.github.io/nyqvra/), choose the settings, generate and copy. No installation is required. Save the result in your preferred password manager: NYQVRA has no history or recovery.

### Windows app — 0.3.0

Download **[Windows x64 installer — 0.3.0](https://github.com/DianaDorozhAI/nyqvra/releases/tag/v0.3.0)**. The separate `NYQVRA-0.3.0-Windows-x64-Setup.exe` installs the app with the NYQVRA icon and shortcuts. Choose English or Russian in the setup wizard.

Explicitly save a selected result with an account name, comment or link. The Journal tab shows its date and label, with show, copy and delete controls. Values are masked by default; generations are not saved automatically.

The journal stays on this computer, encrypted by Windows for the current user account. There is no cloud synchronization, master password or recovery on another computer. Encryption does not protect against malware running as your user. Uninstalling the app does not automatically delete the journal.

The installer is not signed with a publisher certificate, so Windows may display a warning. Do not disable Windows security features. No independent audit has been performed. The website and browser offline ZIP still do not persist generated results.

![Journal with fictional demo accounts](docs/images/nyqvra-windows-journal.png)

### Browser offline ZIP — 0.3.0

1. Download **`NYQVRA-0.3.0-offline.zip`** from [release 0.3.0](https://github.com/DianaDorozhAI/nyqvra/releases/tag/v0.3.0).
2. Extract the **entire** archive.
3. Open **`index.html`** in a modern browser. No internet, Node.js or installer is needed.

This is a local web app, not a Windows executable or installable PWA. If your browser blocks clipboard access for local files, select and copy the output manually. See [offline instructions](docs/OFFLINE.txt).

Releases include **SHA256SUMS.txt**. Verify the ZIP with `Get-FileHash` on Windows or `sha256sum` on Linux. A checksum confirms integrity against a trusted reference, not the absence of vulnerabilities.

## Privacy and the strength estimate

Generation uses **Web Crypto** and unbiased selection. Runtime resources are bundled; there are no application API calls or analytics. The web version does not persist generated results; the Windows app saves only entries explicitly selected by the user. The website host still processes normal page/resource requests.

The rating covers guessing of NYQVRA-generated outputs, not phishing, malware, password reuse or a compromised device/service. The thresholds and assumptions are documented in the [calculation method](docs/SECURITY-MODEL.en.md). **No independent security audit has been performed.** Clipboard history, synchronization and page memory have limitations; see the [security policy](SECURITY.md).

## Documentation

- [Product case study](docs/CASE-STUDY.en.md): problem, audience, alternatives, decisions, journey and evidence.
- [Calculation method](docs/SECURITY-MODEL.en.md): formulas, scenario rates and thresholds.
- [Development and tests](docs/DEVELOPMENT.md): local build, project structure and packaging.
- [Release notes](CHANGELOG.md) and [verification scope](docs/QA.md).

The automated suite contains 24 checks, including journal storage and desktop policy tests, run in CI on Windows/Linux with Node.js 22/24. A separate Windows workflow checks generation, RU/EN, UI saving, encryption, copying and deletion, then builds the installer. See workflow results for the current status. These are regression checks, not security certification.

## License and author

Created by [Diana / DianaDorozhAI](https://github.com/DianaDorozhAI). Original project materials are available under the **[MIT License](LICENSE)**: use, modify and redistribute them, including commercially, while preserving the copyright and license notice. They are provided without warranty; modified versions do not imply the author's endorsement.

The license covers original code, documentation and visual assets to the extent the author holds the relevant rights. Third-party terms remain separate: **EFF — CC BY 3.0 US; Tabler Icons — MIT; Manrope — SIL OFL 1.1**. Full attribution: [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). LICENSE and notices are included in the offline ZIP.
