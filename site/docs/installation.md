---
sidebar_position: 2
---

# Installation

Get started with Shnippet in just a few steps.

## Prerequisites

- Node.js 18.0 or higher
- npm 7.0 or higher
- A project with tests (Jest, Vitest, or other test frameworks supported)
- TypeScript (for type generation support)

## Installation

Install Shnippet as a development dependency in your project:

```bash
npm install --save-dev shnippet
```

## Basic Setup

1. Create a `shnippet.config.js` file in your project root:

```javascript
module.exports = {
  // Root directory containing your source files
  rootDirectory: './src',
  
  // Directory where snippets will be generated (served at /snippets)
  snippetOutputDirectory: './static/snippets',
  
  // File extensions to process
  fileExtensions: ['.js', '.ts', '.kt', '.gradle', '.xml', '.bash', '.swift', '.py'],
  
  // Patterns to exclude from processing
  exclude: [],
  
  // Custom tags for marking snippets
  snippetTags: {
    start: ':snippet-start:',
    end: ':snippet-end:',
    prependStart: ':prepend-start:',
    prependEnd: ':prepend-end:',
  },
  
  // How to organize output files ('byLanguage' or 'flat')
  outputDirectoryStructure: 'byLanguage',
};
```

Each option explained:

- `rootDirectory`: The main directory containing your source files
- `snippetOutputDirectory`: Where generated snippets will be saved
- `fileExtensions`: List of file types to process for snippets
- `exclude`: Array of glob patterns to ignore
- `snippetTags`: Custom markers for identifying snippets in your code
- `outputDirectoryStructure`: 
  - `byLanguage`: Organizes snippets by programming language
  - `flat`: Places all snippets in a single directory

2. Add a script to your `package.json`:

```json
{
  "scripts": {
    "shnippet": "shnippet --config shnippet.config.js"
  }
}
```

## Type Generation

Shnippet automatically generates TypeScript types for your snippet names. After running the extractor, you'll find a `gen-types` directory in your snippets folder containing type definitions.

Import the types in your TypeScript files:

```typescript
import type { SnippetName } from '../snippets/gen-types';

// Now you get type safety and autocomplete for snippet names
const snippetName: SnippetName = 'add'; // ✅ Type-safe
const invalidName: SnippetName = 'not-a-snippet'; // ❌ Type error
```

## Verify Installation

Run Shnippet to verify your installation:

```bash
npm run shnippet
```

If everything is set up correctly, you should see:
- A new `static/snippets` directory created with:
  - `gen-types/index.d.ts` containing your snippet name types
  - `config.json` for runtime (baseUrl, fileExtensions)
  - Generated snippet files organized by extension-derived folders (e.g., `ts/`)
- No error messages in the console

## Next Steps

- [Quick Start](./quick-start) - Learn how to write your first Shnippet
- [Configuration](./configuration) - Explore all configuration options
- [Examples](./examples) - See Shnippet in action with real-world examples

## Troubleshooting

### Common Issues

1. **No snippets generated**
   - Check that your test files match the `include` patterns
   - Verify that your tests contain Shnippet tags
   - Ensure your test files are in the correct directory

2. **Configuration errors**
   - Make sure `shnippet.config.js` is in your project root
   - Verify all paths in the config are correct
   - Check that the config file exports a valid object

3. **Type generation issues**
   - Ensure TypeScript is installed in your project
   - Check that your snippet names are valid identifiers
   - Verify the `gen-types` directory is created in your output directory

### Getting Help

If you encounter any issues:
- Check the [GitHub Issues](https://github.com/dayhaysoos/shnippet/issues)
- Open a new issue if your problem isn't already reported