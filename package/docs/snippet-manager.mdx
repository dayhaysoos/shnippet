---
id: snippet-manager
title: Snippet Manager
description: Programmatic API for fetching and formatting snippets in the browser.
---

The `snippetManager` provides a convenient way to load snippets for multiple languages in browser contexts and format them for display.

## Getting started

```ts
import { snippetManager } from 'shnippet';

// Configure where your built snippets are hosted
snippetManager.updateConfig({
  baseUrl: '/snippets',
  fileExtensions: ['py', 'ts', 'kt'],
});

const result = await snippetManager.getSnippet('example1');
// result.content.py, result.content.ts, result.content.kt
```

## Configuration

Use `updateConfig` to set or override runtime settings. Important options:

- `baseUrl`: Base path where snippet assets are hosted. Default: `/snippets`.
- `fileExtensions`: Extensions to fetch (keys used in `result.content`). Dots optional, e.g. `['py','ts','kt']` or `['.py','.ts','.kt']`.
- `defaultImports`: Optional map of language → imports to include in the result.
- `exclude`: Glob patterns to ignore when relevant.

```ts
snippetManager.updateConfig({
  baseUrl: 'https://cdn.example.com/snippets',
  fileExtensions: ['py', 'ts'],
  defaultImports: {
    py: ['from typing import Any'],
    ts: ["import { useState } from 'react'"],
  },
});
```

## Methods

### updateConfig(config)
Merges the provided `config` with the current configuration and clears the internal cache.

```ts
snippetManager.updateConfig({ fileExtensions: ['py', 'ts'] });
```

### getSnippet(name)
Fetches snippet content for each configured language and returns a `SnippetResult`.

```ts
const result = await snippetManager.getSnippet('add');
// {
//   name: 'add',
//   languages: ['py','ts'],
//   defaultLanguage: 'py',
//   content: { py: '...', ts: '...' },
//   imports?: { py: [...], ts: [...] }
// }
```

### formatSnippet(content, options)
Formats raw snippet text for display. Currently supports optional line numbers.

```ts
const formatted = snippetManager.formatSnippet(result.content.py, {
  language: 'py',
  showLineNumbers: true,
});
```

## Notes

- If `fileExtensions` is not provided at runtime, the manager attempts to fetch `/snippets/config.json` once to auto-load it.
- `defaultLanguage` always falls back to the first entry in `fileExtensions`.
- Keys in `content` and `imports` are the normalized extension keys (no dots).

## SSR and runtime notes

- The `snippetManager` is intended for browser/client usage. Avoid calling it during SSR.
- In frameworks with SSR (e.g., Next.js), call `getSnippet` inside a client component or a `useEffect` so it runs in the browser.
- Ensure `baseUrl` points to a publicly served path. With Docusaurus, files under `static/snippets` are available at `/snippets`.
- If you need server-side access to snippet files, read them directly from the filesystem instead of using `snippetManager`.

See also: [API Reference](./api.md)


