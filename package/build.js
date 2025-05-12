import { build } from 'esbuild';
import { rimraf } from 'rimraf';

// Clean dist directory
await rimraf('dist');

// Build the project
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
        js: '#!/usr/bin/env node\n'
    }
});
