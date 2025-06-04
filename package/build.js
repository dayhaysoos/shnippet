import { build } from 'esbuild';
import { execSync } from 'child_process';

// Clean dist directory
execSync('rm -rf dist');

// Generate types first
execSync('npx tsc --declaration --emitDeclarationOnly --outDir dist --rootDir src');

// Build Node.js CLI bundle
await build({
  entryPoints: ['src/bin/cli.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  format: 'esm',
  outdir: 'dist/bin',
  banner: { js: '#!/usr/bin/env node\n' },
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
  external: ['fs', 'path', 'events', 'stream', 'string_decoder'],
});
