---
sidebar_position: 3
---

# Quick Start

Let's create your first snippet in just a few steps.

## 1. Write a Test

Create a test file with a simple function and its test:

```typescript
// math.test.ts
function add(a: number, b: number): number {
  return a + b;
}

describe('Math functions', () => {
  it('should add two numbers correctly', () => {
    // :snippet-start: add
    const result = add(2, 3);
    // result is 5
    // :snippet-end:
    expect(result).toBe(5);
  });
});
```

## 2. Run Shnippet

Run the snippet generator:

```bash
npm run shnippet
```

This will:
- Find all files with Shnippet tags
- Extract the marked code
- Generate snippet files in your output directory
- Create TypeScript types for your snippet names

The result should look like this:

```
static/snippets/
  gen-types/
    index.d.ts  # Contains your snippet name types
  ts/
    add.snippet.txt
```

The content of `add.snippet.txt` will be:
```
const result = add(2, 3);
// result is 5
```

## 3. Use Your Snippet

Use the SnippetManager to access your snippets in your documentation:

```typescript
import { snippetManager } from 'shnippet';
import type { SnippetName } from '../snippets/gen-types';

// Get a snippet with type safety
const snippet = await snippetManager.getSnippet('add' as SnippetName);

// Pick the default language
const lang = snippet.defaultLanguage; // e.g., 'ts'

// Format a snippet with line numbers
const formattedSnippet = snippetManager.formatSnippet(snippet.content[lang], {
  language: lang,
  showLineNumbers: true,
});
```

Shnippet automatically reads `snippets/config.json` to discover the available file extensions, so `updateConfig` is rarely needed. Only call it if you want to override the generated runtime settings (for example, when hosting snippets from a custom CDN).

## What's Next?

- [Configuration](./configuration) - Learn about all available options
- [Examples](./examples) - See more complex use cases
- [API Reference](./api) - Explore the full API 