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
snippets/
  gen-types/
    index.d.ts  # Contains your snippet name types
  typescript/
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

// Get snippet display info (available languages, imports)
const info = snippetManager.getSnippetDisplayInfo('add');
// info = {
//   languages: ['typescript', 'javascript'],
//   defaultLanguage: 'typescript',
//   imports: { typescript: ['import { add } from "./math"'] }
// }

// Format a snippet with line numbers
const formattedSnippet = snippetManager.formatSnippet(snippet, {
  language: 'typescript',
  showLineNumbers: true
});
```

## What's Next?

- [Configuration](./configuration) - Learn about all available options
- [Examples](./examples) - See more complex use cases
- [API Reference](./api) - Explore the full API 