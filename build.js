// Builds zipped app folders for Windows and macOS (Intel + Apple Silicon).
const { packager } = require('@electron/packager');
const { execSync } = require('child_process');
const fs = require('fs');
(async () => {
  fs.rmSync('out', { recursive: true, force: true });
  const targets = [['win32', 'x64'], ['darwin', 'arm64'], ['darwin', 'x64']];
  for (const [platform, arch] of targets) {
    const [dir] = await packager({
      dir: '.', out: 'out', platform, arch, overwrite: true, asar: true, prune: true,
      ignore: [/^\/out($|\/)/, /^\/dist($|\/)/, /^\/build\.js$/, /^\/\.git($|\/)/],
      appBundleId: 'app.stagesoundboard', appCategoryType: 'public.app-category.music',
    });
    const name = { win32: 'Windows', darwin: arch === 'arm64' ? 'Mac-AppleSilicon' : 'Mac-Intel' }[platform];
    fs.mkdirSync('dist', { recursive: true });
    const zip = `../../dist/StageSoundboard-${name}.zip`;
    execSync(`cd "${dir}" && zip -qry ${zip} .`, { stdio: 'inherit' });
    console.log('built', zip);
  }
})();
