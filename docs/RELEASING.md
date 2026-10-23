# Release checklist

Publishing is an owner action, not an automatic consequence of a third-party PR.

1. Review the exact diff, dependencies and notices. Use dummy data in screenshots.
2. Use a clean checkout, Node.js 22/24: `npm run build`, `npm test`, `npm run package`.
3. Check ZIP inventory: only runtime assets, START-HERE, notices and checksums. No credentials, user data or working files.
4. Extract and open `index.html` locally. Test manual copying if clipboard access is blocked.
5. Verify desktop/phone, long output, phrases, weak/medium/strong labels, draft settings, RU/EN, dialogs, keyboard and console.
6. Update version, changelog, screenshots and versioned download instructions together.
7. Tag the reviewed commit. Publish ZIP and `SHA256SUMS.txt` as release assets. Do not silently replace released files; issue a new version for changes.
8. Pages deploys only pushes to `main` or owner-requested workflow runs, after tests. PR jobs have no deployment permission.
9. Confirm the live site and offline download before announcing completion.

The ZIP has a fixed timestamp, explicit inventory and DEFLATE. Identical inputs with the same Node/zlib toolchain produce identical bytes; cross-version compression output may differ. SHA-256 is not a security audit or code-signing certificate.
