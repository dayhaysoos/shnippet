---
sidebar_position: 4
---

# CLI Reference

Shnippet's command-line interface is the primary way to extract and manage your code snippets.

## Basic Usage

```bash
# Run with default config
npm run shnippet

# Run with custom config
npm run shnippet --config ./custom.config.js

# Clear generated snippets
npm run shnippet clear
```

## Command Options

| Option | Description | Default |
|--------|-------------|---------|
| `--config` | Path to config file | `./shnippet.config.js` |
| `--structure` | Output structure (`byLanguage` or `flat`) | `byLanguage` |
| `clear` | Remove all generated snippets | - |

## Configuration File

Create a `shnippet.config.js` in your project root:

```javascript
module.exports = {
  // Root directory containing your source files
  rootDirectory: './src',

  // Directory where snippets will be generated (served at /snippets)
  snippetOutputDirectory: './static/snippets',

  // File extensions to process
  fileExtensions: ['.ts'],

  // Patterns to exclude from processing
  exclude: [],

  // Custom tags for marking snippets
  snippetTags: {
    start: ':snippet-start:',
    end: ':snippet-end:',
    prependStart: ':prepend-start:',
    prependEnd: ':prepend-end:',
  },

  // How to organize output files
  outputDirectoryStructure: 'byLanguage',
};
```

## Output Structure

> **Note**: For now, it's recommended to stick with the default `byLanguage` structure. Other options are available but may have limited support.

### By Language (`byLanguage`)
```
static/snippets/
  gen-types/
    index.d.ts
  ts/
    add.snippet.txt
    multiply.snippet.txt
  py/
    add.snippet.txt
```

### Flat Structure (`flat`)
```
snippets/
  gen-types/
    index.d.ts
  add.snippet.txt
  multiply.snippet.txt
```

## Type Generation

The CLI automatically generates TypeScript types for your snippet names in `static/snippets/gen-types/index.d.ts`:

```typescript
export type SnippetName = 'add' | 'multiply' | 'other-snippet';
```

These types are updated each time you run the CLI, ensuring they stay in sync with your actual snippets.

## Common Tasks

### Extract Snippets
```bash
npm run shnippet
```

### Clear Generated Files
```bash
npm run shnippet clear
```

### Use Custom Config
```bash
npm run shnippet --config ./custom.config.js
```

### Change Output Structure
```bash
npm run shnippet --structure flat
```

## Troubleshooting

### No Snippets Generated
- Check that your test files match the `include` patterns
- Verify that your tests contain Shnippet tags
- Ensure your test files are in the correct directory

### Configuration Errors
- Make sure `shnippet.config.js` is in your project root
- Verify all paths in the config are correct
- Check that the config file exports a valid object

### Type Generation Issues
- Ensure TypeScript is installed in your project
- Check that your snippet names are valid identifiers
- Verify the `gen-types` directory is created in your output directory 