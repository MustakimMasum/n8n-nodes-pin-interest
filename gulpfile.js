const fs = require('fs');
const path = require('path');
const { src, dest, series } = require('gulp');

function copyNodeIcons() {
  const nodeSource = path.resolve('nodes', 'PinInterest', '*.{png,svg}');
  const nodeDestination = path.resolve('dist', 'nodes');
  // allowEmpty avoids errors if no icons exist yet
  return src(nodeSource, { allowEmpty: true }).pipe(dest(nodeDestination));
}

function copyCredentialIcons() {
  const credRoot = path.resolve('credentials');
  const credSource = path.resolve(credRoot, '**', '*.{png,svg}');
  const credDestination = path.resolve('dist', 'credentials');

  // If there's no credentials directory, no-op gracefully
  if (!fs.existsSync(credRoot)) return Promise.resolve();

  return src(credSource, { allowEmpty: true }).pipe(dest(credDestination));
}

exports['build:icons'] = series(copyNodeIcons, copyCredentialIcons);
