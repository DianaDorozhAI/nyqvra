# Contributing

Start with an issue describing the bug or proposed change. Use dummy passwords in reports and screenshots. Security issues belong in [private reporting](SECURITY.md).

NYQVRA's original code and documentation are MIT-licensed. By submitting a contribution, you agree to make it available under the same license and confirm you have the rights to contribute it. Third-party materials retain their own licenses; include attribution and license notices for any additions.

For an agreed change:

1. Keep generation separate from UI and animation.
2. Add deterministic regression tests for the actual failure, not flaky statistical assertions.
3. Run `npm run build`, `npm test` and `npm run package` on Node.js 22/24.
4. Check small phone and desktop layouts, keyboard controls and reduced motion for UI changes.
5. Do not add analytics, external CDNs, password persistence or dependencies without discussion.
6. Do not claim protection from phishing, malware or all future attacks.

Pull requests are proposals, not direct write access. Only authorized maintainers publish the official site and releases.
