---
id: configuration
title: Configuration Reference
description: All available shnippet.config options with defaults and examples.
---

This page lists every configuration option for Shnippet and how to use it.

## Example

```ts
// shnippet.config.ts (or .js)
export const config = {
  rootDirectory: './tests',
  snippetOutputDirectory: './static/snippets',
  fileExtensions: ['.ts', '.py'],
  exclude: [],
  snippetTags: {
    start: ':snippet-start:',
    end: ':snippet-end:',
    prependStart: ':prepend-start:',
    prependEnd: ':prepend-end:',
  },
  outputDirectoryStructure: 'byLanguage',
  version: '1.0.0',
};
```

## Options

- **rootDirectory**: Directory containing source files to scan for snippets.
  - Type: `string`
  - Example: `./tests`

- **snippetOutputDirectory**: Directory where extracted snippets are written.
  - Type: `string`
  - Example: `./static/snippets`

- **fileExtensions**: File types to process. Dots optional.
  - Type: `string[]`
  - Example: `['.ts', '.py']` or `['ts', 'py']`

- **exclude**: Snippet names to skip.
  - Type: `string[]`
  - Example: `['exampleToSkip']`

- **snippetTags**: Custom markers for snippet boundaries and prepend blocks.
  - Type:
    ```ts
    {
      start: string;
      end: string;
      prependStart: string;
      prependEnd: string;
    }
    ```
  - Defaults: `:snippet-start:`, `:snippet-end:`, `:prepend-start:`, `:prepend-end:`

- **outputDirectoryStructure**: Controls how snippets are organized on disk.
  - Type: `'byLanguage' | 'flat'`
  - Default: `'byLanguage'`
  - Examples:
    - `byLanguage`: `snippets/ts/add.snippet.txt`, `snippets/py/add.snippet.txt`
    - `flat`: `snippets/add.snippet.txt`

- **version**: Optional version subfolder for outputs.
  - Type: `string`
  - Example: `'1.0.0'` → `snippets/1.0.0/...`

## Browser Client (snippetManager)

If you use the browser client, configure it at runtime:

```ts
import { snippetManager } from 'shnippet';

snippetManager.updateConfig({
  baseUrl: '/snippets',
  fileExtensions: ['ts', 'py'], // extension keys without dots
  defaultImports: {
    py: ['from typing import Any'],
  },
});
```

- **baseUrl**: Where the browser fetches snippet files from.
  - Type: `string`
  - Default: `/snippets`

- **fileExtensions**: Keys for `result.content` (e.g., `result.content.ts`).
  - Type: `string[]`
  - Required by the client at runtime; first entry becomes `defaultLanguage`.

- **defaultImports**: Optional map of extension key to imports list.
  - Type: `Record<string, string[]>`
  - Example: `{ py: ['from typing import Any'] }`

Notes:
- Dots are optional in `fileExtensions` across both extractor and client.
- The client attempts to auto-load `/snippets/config.json` for `fileExtensions` if not set.
- The browser client is not SSR-safe; call it in the browser only, and ensure `baseUrl` serves files publicly (e.g., Docusaurus `static/snippets` → `/snippets`).


