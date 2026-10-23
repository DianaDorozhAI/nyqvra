# Third-party materials

These notices apply only to the identified materials. They do not license the entire NYQVRA project under MIT.

## EFF Large Wordlist (2016)

- Author: Electronic Frontier Foundation.
- Source: https://www.eff.org/files/2016/07/18/eff_large_wordlist.txt
- Project: https://www.eff.org/dice
- License: Creative Commons Attribution 3.0 United States, https://creativecommons.org/licenses/by/3.0/us/
- Copyright policy: https://www.eff.org/copyright
- Embedded in `src/wordlist.js`. Numeric dice indices were removed; words, including internal hyphens, are unchanged. Fixed spaces separate words.
- Attribution: `src/assets/EFF-NOTICE.txt`. EFF does not endorse NYQVRA.

## Tabler Icons

- Author: Paweł Kuna and Tabler contributors.
- Source: https://github.com/tabler/tabler-icons
- License: MIT; full notice: `src/assets/Tabler-LICENSE.txt`.
- Files: `src/assets/icons/*` and `src/assets/refresh.svg`.
- Changes: pointer recolored with lilac glow and rasterized to PNG for cursor compatibility; plus icon padded for a background grid. Original icon geometry retained.

## Manrope

- Authors: The Manrope Project Authors.
- Source: https://github.com/googlefonts/manrope
- License: SIL Open Font License 1.1.
- Font and notice: `src/assets/fonts/Manrope.ttf`, `Manrope-OFL.txt`.

## NYQVRA artwork

Knight images were generated with OpenAI image generation from the project's selected visual references and refined during design iteration. They are not third-party product screenshots or security certifications.

- `nyqvra-armor-lilac-v2.png`: smoky-lilac armor background, 1536 × 1024.
- `nyqvra-armor-lilac-wide-v3.png`: generated horizontal continuation, 1774 × 887. The request asked to preserve scale, translucent materials and lilac palette while extending the dark smoky field. Generative editing does not guarantee pixel-identical preservation of the center.
- No functional controls or passwords are baked into these images.

The NYQVRA wordmark and procedural animated knot belong to the project, not Tabler. The animation does not supply cryptographic randomness.
