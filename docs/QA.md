# Release verification — 0.2.0

## Automated

19 Node.js tests pass locally. They cover random-index rejection, allowed pools, settings, constrained entropy, passphrases/list integrity, guessing calculations, restrictive server routes/headers, exact ZIP/build inventory, SHA-256 integrity and repeatable packaging with the same toolchain.

CI additionally runs the suite on Windows and Linux with Node.js 22 and 24. Its actual result is visible in the Checks workflow; this document does not substitute for a green run.

## Browser evidence

- Desktop 1536 × 1024: panel x371.7/y356.3, 860 × 460; no horizontal overflow, images loaded.
- Default result: 24 characters, full pool; strong label and native icon actions.
- Settings draft 128 preserves current 24-character result until generation.
- 128 characters at 390px: field clientHeight209 = scrollHeight209; document clientWidth375 = scrollWidth375.
- 128 characters at 320px: clientHeight244 = scrollHeight244; document clientWidth305 = scrollWidth305.
- Scroll check: bottom panel chamfers and generation action remain complete.
- Eight digits: weak label; explanation shows low resistance in all three scenarios.
- Twelve full-pool characters: moderate label.
- Copy confirms success; hide changes visible output to bullets.
- Format change preserves the result until the next generation.
- Dialogs use keyboard-accessible native dialog controls; Escape returns to the generator.
- Tablet 768 × 1024: no horizontal overflow. Background was distanced to restore left-text contrast.
- Knight transform and animation are `none`; only brand marks animate.

## Intentional visual differences

The final interface preserves the user's current lilac direction, new animated knot and icon-only actions. Compared with the earlier lime reference, panel height and content spacing are not pixel-identical. Further visual changes were explicitly paused by the owner; the proposed cleaned background was not applied.

## Limits

The embedded verification browser allows HTTP/HTTPS only and rejected local `file://` navigation. Direct double-click launch of the extracted HTML was therefore not browser-verified here. The ZIP was extracted and its contents/hashes checked; web rendering is verified separately. No native installer, installable PWA, Safari/Firefox matrix or independent security audit is claimed.

## 0.2.1 follow-up

The MIT license is included in the offline ZIP and checked by the packaging test. The product case study was expanded in Russian/English, while README became a shorter product overview. Participation invitations were removed.

For wide-screen framing, the original armor image now supplies the foreground rather than the horizontally regenerated version. At desktop aspect ratios of17:10 or wider it uses a static112% viewport-height crop, preserving the asset's aspect ratio and placing more of the shoulder below the frame. The blurred background continuation is unchanged. This is a scoped correction requested after the earlier design pause; no background cleanup image was applied.
