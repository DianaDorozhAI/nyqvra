// Exact public runtime inventory. Packaging never sweeps the working directory.
export const runtimeFiles = [
  'index.html', 'src/app.js', 'src/engineering.css', 'src/engineering-effects.js',
  ...['nyqvra-armor-lilac-v2.png', 'nyqvra-armor-lilac-wide-v3.png',
    'nyqvra-wordmark.svg', 'nyqvra-mark.svg', 'refresh.svg',
    'Tabler-LICENSE.txt', 'EFF-NOTICE.txt', 'SECURITY-MODEL.txt',
    'fonts/Manrope.ttf', 'fonts/Manrope-OFL.txt',
    ...['adjustments', 'alert-triangle', 'arrow-up-right', 'check', 'copy',
      'engineering-grid', 'eye-off', 'eye', 'info-circle', 'plus',
      'pointer-lilac', 'shield-check', 'shield-x', 'x'].map(n => `icons/${n}.svg`),
    'icons/pointer-lilac.png',
  ].map(n => `src/assets/${n}`),
];
