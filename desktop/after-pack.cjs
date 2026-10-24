module.exports = async context => {
  const { flipFuses, FuseVersion, FuseV1Options } = await import('@electron/fuses');
  const path = require('node:path');
  await flipFuses(path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.exe`), {
    version: FuseVersion.V1,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
  });
};
