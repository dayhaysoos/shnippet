---
id: snippet-start
title: snippet-start
sidebar_label: snippet-start
description: How to mark and customize snippet boundaries with snippet-start and snippet-end
---

Use snippet tags to mark exactly which lines Shnippet should grab from your test files. The extractor scans your files, finds these tags, normalizes indentation, preserves the content within the tags, and writes it to `.snippet.txt` files.

## Default tags

By default, Shnippet looks for the following markers:

```
:snippet-start: <name>
:snippet-end:
```

Example (TypeScript test):

```ts
describe('Math functions', () => {
  it('adds', () => {
    // :snippet-start: add
    const result = add(2, 3);
    // result is 5
    // :snippet-end:
    expect(result).toBe(5);
  });
});
```

- Everything between `:snippet-start: add` and `:snippet-end:` becomes the snippet named `add`.
- Comments inside the region are preserved in the generated snippet.

## Customizing the tags

You can customize the start and end markers in your config. In Docusaurus (docs site), we use `docs/shnippet.config.js` (CommonJS):

```js
module.exports = {
  // ...other options
  snippetTags: {
    start: ':snippet-start:',
    end: ':snippet-end:',
    prependStart: ':prepend-start:',
    prependEnd: ':prepend-end:',
  },
};
```

Change `start` and `end` if you prefer different markers, e.g.:

```js
snippetTags: {
  start: ':anything:',
  end: ':you-want:',
  prependStart: ':start-imports:',
  prependEnd: ':end-imports:',
}
```

**Note**

I highly recommend using colons to start and end your strings because I haven't tested if they work otherwise :D



The extractor will then use those custom strings instead of the defaults.

## Where the output goes

Output location depends on your config. In the docs site, we write to `static/snippets`, then fetch from `/snippets/<ext>/<name>.snippet.txt` at runtime (extension-derived keys like `ts`, `js`).

```js
module.exports = {
  // ...
  snippetOutputDirectory: './static/snippets',
  outputDirectoryStructure: 'byLanguage',
};
```

## Tips

- Keep snippet regions minimal—only the lines you want to show.
- Name snippets uniquely per language (Shnippet generates `SnippetName` types from discovered names).
- If you customize tag strings, make sure they don’t appear elsewhere in your code accidentally.

