---
sidebar_position: 1
---

# Introduction

Shnippet is a powerful tool for extracting and managing code snippets from your codebase. It helps you maintain a single source of truth for your code examples while ensuring they stay in sync with your actual code.

## Features

- Extract code snippets from your codebase using simple tags
- Support for multiple programming languages
- TypeScript support with generated types
- CLI and programmatic API
- Browser and Node.js support

## Quick Start

```bash
npm install shnippet
```

Then create a snippet in your code:

```typescript
// :snippet-start: example
const result = add(2, 3);
// :snippet-end:
```

And use it in your documentation:

```typescript
import { snippetManager } from 'shnippet';

const snippet = await snippetManager.getSnippet('example');
console.log(snippet.content);
``` 