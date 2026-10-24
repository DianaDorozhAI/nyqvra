# NYQVRA: from generation to an understandable strength estimate

[Русский](CASE-STUDY.md) · **English**

NYQVRA generates random passwords locally and helps people understand how their choices affect resistance to guessing. The project progressed from a concept to a published web app, an autonomous download and an open repository.

**Product creator: Diana / [DianaDorozhAI](https://github.com/DianaDorozhAI).** The work covered problem definition, alternative review, interaction design, implementation and release preparation. Code and documentation were developed with AI assistance; product and visual decisions were refined through successive iterations.

[Open app](https://dianadorozhai.github.io/nyqvra/) · [Download offline](https://github.com/DianaDorozhAI/nyqvra/releases/latest) · [Source](https://github.com/DianaDorozhAI/nyqvra)

![NYQVRA main screen](images/nyqvra-desktop.jpg)

## 1. Problem and product hypothesis

Browsers and password managers already generate random strings. A new tool cannot justify itself solely through longer outputs or claims that a password is impossible to crack.

NYQVRA takes a narrower approach: connect generation to an understandable explanation of guessing resistance. A person sets constraints, receives an output and sees how its assessment changes under different checking conditions, without reading formulas, registering or sending the output to a separate checking service.

**Hypothesis:** a concise rating beside the result, with an explanation available on request, can support a more informed choice of length and format than a standalone “strong password” label. This is a design hypothesis, not a validated user-research finding.

## 2. Intended audience and moment of use

The main scenario is someone creating an account or changing credentials who needs a unique result matching a service's requirements.

Three needs shaped the design:

- **Get a result quickly**, without installation or preliminary setup.
- **Understand the assessment**, without becoming a cryptography specialist.
- **Work autonomously**, using a downloaded copy without connecting to the website.

This audience is a project assumption. Interviews and segmentation based on observed usage have not yet been conducted.

## 3. What the alternatives review informed

The review compared public product descriptions and distribution models, not the alleged strength of competing algorithms.

| Example | Observation | NYQVRA decision |
| --- | --- | --- |
| [Homelab Vault](https://github.com/jakubgt/homelab-vault-gen) | Browser tool with an offline download and separate security documentation | Combine quick web access with a ready-to-run local archive |
| [Offline Password Generator](https://github.com/spidersalt/offline-password-generator) | An extracted HTML file provides autonomous access | Do not make people build source code to launch locally |
| [KeePassXC](https://github.com/keepassxreboot/keepassxc) | A desktop manager with generation inside a broader product | Do not try to replace a password manager in the initial release |

The outcome was not a larger feature checklist. Comparable cryptographic primitives are already available elsewhere. NYQVRA's intended distinction is the journey: **generate locally → understand the estimate → copy the result**.

## 4. Defining the first release

The original concept considered a broader security-analysis tool. During refinement, checking arbitrary user-entered passwords was separated from the core idea: human-chosen patterns and independently random outputs require different assumptions.

The first release therefore focuses on its own generated results:

- random strings of 8–128 characters;
- phrases of 4–10 English words;
- selectable character classes and optional presence of every selected class;
- a strength assessment with three guessing scenarios;
- website and autonomous download.

A vault, history, user-entered password analysis and breach lookup are outside that scope. The boundary makes the product easier to explain and keeps the estimate tied to known generation assumptions.

## 5. Core user journey

1. A generated result is available when the app opens.
2. The person chooses length and character classes, or switches to a word phrase.
3. Draft settings do not erase the current result. Explicit generation replaces it.
4. A concise label communicates high, moderate or low guessing resistance.
5. Activating the rating opens an explanation and scenario comparison.
6. The person copies the output and saves it in their chosen password manager.

Keeping the current result during configuration supports experimentation without losing a previously generated option before making a decision.

## 6. Making the explanation useful

An earlier version exposed entropy, enormous brute-force durations, rates and formulas. That explained the model's mechanics, but pushed the immediate question—“How should I judge this result?”—into the background.

The information was split into three layers:

| Layer | Content | Purpose |
| --- | --- | --- |
| Main screen | Concise rating beside the output | Quickly decide whether to strengthen the settings |
| On-demand explanation | Guessing conditions and their relative ratings | Understand why the same output can be assessed differently |
| Documentation | Formulas, rates, thresholds and limitations | Make the method inspectable without overloading the UI |

Separate “strong password” and “why this estimate?” lines became one action. Copy and show/hide were grouped together as icons with accessible names. The explanation refers directly to the displayed output rather than asking someone to run a redundant check on a newly generated result.

## 7. Locality as an architectural decision

Local generation must be supported by the implementation, not just a headline. NYQVRA has no password-processing server. Web Crypto supplies randomness, while the wordlist and other assets are bundled. Rejection sampling prevents bias when mapping random values to indices.

On the website, generation runs in the browser after the app loads. For autonomous use, the same interface is packaged as HTML and local assets, without requiring a development environment.

One core supports both delivery methods, keeping the initial release manageable. A native installer was not added without a separate user need that would justify maintaining it.

## 8. Interface priorities

The visual goal was a recognizable technical tool that keeps attention on the result. One working surface contains the output, its assessment, settings and regeneration action.

Iterations addressed readability, action placement, the amount of explanatory copy and long-output behavior. Secondary settings were moved out of the main journey. Responsive layouts aim to preserve reachable controls rather than shrink the whole screen.

The visual identity supports recognition; it is not evidence of security. Presentation details do not replace product value or an inspectable implementation.

## 9. Delivery and evidence

The initial public release delivered the live app, offline ZIP, repository, Russian/English instructions and calculation documentation. Version 0.2.1 adds the MIT License while preserving third-party terms.

Verification includes:

- 19 automated tests covering generation, constraints, calculations, wordlist, builds and packaging;
- successful Windows/Linux CI runs with Node.js 22/24;
- browser checks of primary actions and multiple layout widths;
- distinct weak, moderate and strong results rather than an always-positive label;
- explicit archive inventory and SHA-256 verification of the downloaded release.

This supports the behavior of the tested implementation, not universal usability or the absence of every vulnerability. No independent security audit, participant research or validated business metrics are claimed. Offline launch across browsers still needs separate verification.

## 10. Next validation step

The next step is to test the core hypothesis through real tasks: can someone understand the rating, notice the effect of changing settings and move from generation to saving without assistance?

Task completion time, journey errors and the ability to explain the assessment in one's own words would be useful measures. These are **planned measurements**, not achieved results. Independent review of generation, modeling and delivery is a separate workstream.

**Case outcome:** an “another generator” idea became a bounded, functioning product with an explainable estimate and two delivery methods. Further development should test that value, rather than simply accumulate features.
