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
    // :shnippet-end:
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
- Generate snippet files in your output directory as .txt files

The result should look like this:

```
const result = add(2, 3);
// result is 5
```

## 3. Use Your Snippet

Use the SnippetManager to access your snippets in your documentation:

```typescript
import { snippetManager } from 'shnippet';

// Get a snippet, make sure you use the name from where you started snipping. (after the :snippet-start: tag)
const snippet = await snippetManager.getSnippet('add', 'typescript');

// Get snippet display info (available languages, imports)
const info = snippetManager.getSnippetDisplayInfo('math.test');
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