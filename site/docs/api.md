---
sidebar_position: 5
---

# API Reference

The `snippetManager` is a utility for fetching and displaying code snippets in your frontend application. It handles caching, extension-derived language selection, and optional imports.

See also: [Snippet Manager](./snippet-manager.md) for a higher-level guide and examples.

## Import

```typescript
import { snippetManager } from 'shnippet';
import type { SnippetName } from '../snippets/gen-types';
```

## Methods

### getSnippet

Fetches a snippet by name.

```typescript
const result = await snippetManager.getSnippet('add' as SnippetName);
```

Returns a `SnippetResult` object:
```typescript
interface SnippetResult {
  name: string;
  languages: string[];
  defaultLanguage: string;
  imports?: Record<string, string[]>;
  content: Record<string, string>;
}
```

### formatSnippet

Formats a snippet with optional line numbers.

```typescript
const formatted = snippetManager.formatSnippet(result.content[result.defaultLanguage], {
  language: result.defaultLanguage,
  showLineNumbers: true,
});
```

### updateConfig

> **Note**: You likely won't need to use this method. Defaults are read from `/snippets/config.json` generated at build time.

Updates the snippet manager configuration.

```typescript
snippetManager.updateConfig({
  baseUrl: '/snippets',
  fileExtensions: ['ts'], // use extension keys (dots optional)
});
```

## Example Usage

```typescript
import { snippetManager } from 'shnippet';
import type { SnippetName } from '../snippets/gen-types';

async function displaySnippet() {
  // Get the snippet
  const result = await snippetManager.getSnippet('add' as SnippetName);
  
  // Get available languages and default language
  const { languages, defaultLanguage, imports, content } = result;
  
  // Format with line numbers
  const formatted = snippetManager.formatSnippet(content[defaultLanguage], {
    language: defaultLanguage,
    showLineNumbers: true,
  });
  
  return formatted;
}
```

## Type Safety

The `snippetManager` works with the generated `SnippetName` type to ensure type safety:

```typescript
import type { SnippetName } from '../snippets/gen-types';

// Type-safe snippet fetching
const result = await snippetManager.getSnippet('add' as SnippetName); // ✅ Valid
const invalid = await snippetManager.getSnippet('not-a-snippet' as SnippetName); // ❌ Type error
```

## Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| `baseUrl` | `string` | Base URL for fetching snippets (default `/snippets`) |
| `fileExtensions` | `string[]` | Required at runtime (e.g., `['ts','py']`). Keys are normalized extensions without dots; defaultLanguage is the first entry. |
| `defaultImports` | `Record<string, string[]>` | Optional imports per extension key |