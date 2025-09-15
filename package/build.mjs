import { build } from 'esbuild';
import { glob } from 'glob';
import { rimraf } from 'rimraf';
import { execSync } from 'child_process';

// Clean dist directory
await rimraf('dist');

// Generate types first
execSync('npx tsc --declaration --emitDeclarationOnly --outDir dist --rootDir src');

// Common Node.js built-in modules that should be external
const nodeBuiltins = [
    'fs',
    'path',
    'events',
    'stream',
    'string_decoder',
    'url',
    'fs/promises',
    'node:fs',
    'node:path',
    'node:url',
    'node:events',
    'node:stream',
    'node:string_decoder',
    'node:fs/promises'
];

// Build Node.js CLI bundle (ESM)
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
    external: nodeBuiltins
});

// Build browser ESM bundle (for bundlers like webpack)
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
    external: nodeBuiltins
});

// Build main bundle (ESM)
await build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'neutral',
    target: 'node18',
    format: 'esm',
    outdir: 'dist',
    sourcemap: true,
    minify: false,
    external: nodeBuiltins
});

// Build main bundle (CJS)
await build({
    entryPoints: ['src/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    outfile: 'dist/index.cjs',
    sourcemap: true,
    minify: false,
    external: nodeBuiltins
});