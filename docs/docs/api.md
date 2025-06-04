---
sidebar_position: 5
---

# API Reference

The `snippetManager` is a utility for fetching and displaying code snippets in your frontend application. It handles caching, language-specific formatting, and imports.

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
const formatted = snippetManager.formatSnippet(snippet, {
  language: 'typescript',
  showLineNumbers: true
});
```

### updateConfig

> **Note**: You likely won't need to use this method. It's only necessary for advanced use cases like custom snippet servers or language-specific configurations.

Updates the snippet manager configuration.

```typescript
snippetManager.updateConfig({
  baseUrl: 'http://your-snippet-server.com/snippets',
  supportedLanguages: ['typescript', 'python'],
  defaultImports: {
    typescript: ['import { useState } from "react"'],
    python: ['from typing import Any']
  }
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
  const formatted = snippetManager.formatSnippet(result, {
    language: defaultLanguage,
    showLineNumbers: true
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
| `baseUrl` | `string` | Base URL for fetching snippets |
| `supportedLanguages` | `string[]` | Languages to support |
| `defaultImports` | `Record<string, string[]>` | Default imports for each language | 