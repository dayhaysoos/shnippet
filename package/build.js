import { build } from 'esbuild';
import { rimraf } from 'rimraf';

// Clean dist directory
await rimraf('dist');

// Build Node.js bundle
await build({
  entryPoints: ['src/index.ts', 'src/bin/cli.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outdir: 'dist',
  outExtension: { '.js': '.js' },
  external: ['rimraf'],
  banner: {
    js: '#!/usr/bin/env node\n',
  },
  sourcemap: true,
  minify: false,
});

// Build client-side bundle
await build({
  entryPoints: ['src/client.ts'],
  bundle: true,
  platform: 'browser',
  target: ['es2020'],
  format: 'esm',
  outdir: 'dist',
  outExtension: { '.js': '.browser.js' },
  sourcemap: true,
  minify: true,
  globalName: 'Shnippet',
});
