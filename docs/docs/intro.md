---
sidebar_position: 1
---

# Introduction

Shnippet is a powerful tool that allows you to use your tests as content for your documentation. It ensures your code examples are always accurate, up-to-date, and working.

## The Problem

Have you ever:
- Written documentation with code examples that later became outdated after a new release? (Yes)
- Had to manually update documentation when your code changed? (Yes)
- Wondered if your documentation examples actually work? (Yes)

These are common problems in software development. Documentation often becomes stale because it's maintained separately from the code it describes.

## The Solution

Shnippet solves this by:
1. **Extracting code snippets** from your test files
2. **Validating them** through your test suite
3. **Keeping them in sync** with your examples by letting you surface those tests in your documentation

This means your documentation is:
- Always accurate
- Always tested
- Always up-to-date

This saves valuable time for both documentation teams and product teams:
- Documentation writers no longer need to manually verify and update examples
- Product teams can focus on building features instead of maintaining documentation
- Release cycles become smoother with automatically synchronized docs
- QA teams can trust that documentation examples have already passed tests

## How It Works

```typescript
// Your test file
describe('Math functions', () => {
  it('should add two numbers correctly', () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });
});

// Add Shnippet tags to extract the example
describe('Math functions', () => {
  it('should add two numbers correctly', () => {
    // :snippet-start: add
    const result = add(2, 3);
    // result is 5
    // :snippet-end:
    expect(result).toBe(5);
  });
});

// Shnippet automatically generates:
// 1. A snippet file in snippets/typescript/add.snippet.txt
const result = add(2, 3);
// result is 5

// 2. Type definitions in snippets/gen-types/index.d.ts
export type SnippetName = 'add' | 'other-snippet';
```

## Key Features

- **Test-Driven Documentation**: Your examples are validated by your test suite
- **Automatic Updates**: Documentation stays in sync with your code
- **Multiple Formats**: Support for various programming languages and documentation formats
- **Prepend Blocks**: Include necessary imports and setup code
- **CLI Tool**: Easy integration into your build process
- **Type Safety**: Automatically generated TypeScript types for your snippet names

## Getting Started

Ready to try Shnippet? Check out the [Installation](./installation) guide to get started.

## Why Shnippet?

- **Trust**: Your documentation is as reliable as your tests
- **Efficiency**: Write once, use everywhere
- **Maintenance**: No more manual updates
- **Confidence**: Know your examples work

## Next Steps

- [Installation](./installation)
- [Quick Start](./quick-start)
- [Configuration](./configuration)
- [Examples](./examples)
