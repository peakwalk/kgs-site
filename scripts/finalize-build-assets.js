const { copyFileSync, mkdirSync } = require('node:fs');
const { resolve } = require('node:path');

// Keep the published Open Graph image URL stable across Parcel builds.
const assets = resolve(__dirname, '../public/assets');
mkdirSync(assets, { recursive: true });
copyFileSync(
  resolve(__dirname, '../src/assets/social-1200x630.png'),
  resolve(assets, 'social-1200x630.png'),
);
