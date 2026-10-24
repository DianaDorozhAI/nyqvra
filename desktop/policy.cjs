'use strict';
const ORIGIN = 'nyqvra://app';
const externalLinks = new Set([
  'https://github.com/DianaDorozhAI/nyqvra',
  'https://github.com/DianaDorozhAI/nyqvra/releases/latest',
  'https://github.com/DianaDorozhAI/nyqvra/releases/tag/v0.3.0',
]);
function isLocal(url) {
  try { const u = new URL(url); return u.protocol === 'nyqvra:' && u.host === 'app' && !u.username && !u.password; }
  catch { return false; }
}
function externalAllowed(url) { return externalLinks.has(url); }
function resourcePath(url, inventory) {
  if (!isLocal(url)) return null;
  try {
    const path = decodeURIComponent(new URL(url).pathname).replace(/^\//, '');
    return inventory.has(path) ? path : null;
  } catch { return null; }
}
module.exports = { ORIGIN, isLocal, externalAllowed, resourcePath };
