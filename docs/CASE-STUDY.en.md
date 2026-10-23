# NYQVRA — product case study

[Русский](CASE-STUDY.md) · **English**

## Problem

Generate locally and explain guessing resistance without turning the main screen into a technical lab. Offer fast web access and an autonomous download.

## Format research

Public documentation of [Homelab Vault](https://github.com/jakubgt/homelab-vault-gen), [Offline Password Generator](https://github.com/spidersalt/offline-password-generator) and [KeePassXC](https://github.com/keepassxreboot/keepassxc) informed the distribution review. The first two demonstrate browser/offline delivery; KeePassXC is a broader desktop password-manager category. This was not a code audit of those projects.

The selected format is a website plus a ready-to-run local folder sharing one core, rather than a native wrapper solely for packaging.

## Visual system and UX

Translucent armor conveys protection; the frosted panel is the working surface. Lilac accents unify controls and branding. The knight stays static; only the brand mark animates, respecting reduced motion.

- Immediate result without account setup.
- Draft settings do not destroy the current result.
- Adjacent icon-only copy/show actions retain accessible names.
- One clickable rating opens the explanation instead of duplicating labels.
- Formulas and huge durations live in documentation, not the main UI.
- Long output expands the panel instead of clipping.
- Layout adapts to narrow screens.
- A blurred continuation fills the background without zooming the knight to cover every viewport.

## Implementation and boundaries

Web Crypto, unbiased sampling, constrained entropy and the bundled EFF wordlist. No application transmission or persistent storage of generated output. The estimate covers guessing, not account security or device protection.

The release includes automated checks, browser QA, offline instructions, checksums and source. This is not an independent security audit.

## Evidence limits

No participant studies, conversion data, validated business metrics or certifications are claimed. Real user testing and independent security review remain future work.
