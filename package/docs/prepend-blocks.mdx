---
id: prepend-blocks
title: Prepend blocks
sidebar_label: prepend-blocks
description: Add imports or setup code ahead of your extracted snippet content
---

Prepend blocks let you attach language-specific imports (or any setup code) before the extracted snippet content, so examples are copy‑paste ready.

## How prepend blocks work

Associate a prepend block with one or more snippet names by listing the names on the same line as `prependStart`.

```ts
// :prepend-start: add
import { add } from '../math';
// :prepend-end:

// :snippet-start: add
const result = add(2, 3);
// :snippet-end:
```

When the snippet `add` is generated, the import block is prepended to the snippet content (newlines preserved).

## Configuring prepend block tags

You can customize the prepend markers via your config. In this docs site we use `site/shnippet.config.js`:

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

To choose your own strings:

```js
snippetTags: {
  start: ':snippet-start:',
  end: ':snippet-end:',
  prependStart: ':start-imports:',
  prependEnd: ':end-imports:',
}
```

The extractor will then use those custom strings instead of the defaults. As with `snippet-start`, using a colon‑prefixed convention helps avoid accidental matches elsewhere in code.

## Output location

In this docs site we write generated files to `static/snippets`, which are then served from `/snippets`:

```js
module.exports = {
  // ...
  snippetOutputDirectory: './static/snippets',
  outputDirectoryStructure: 'byLanguage',
};
```

At runtime, the demo fetches paths like `/snippets/ts/add.snippet.txt`.

## Tips

- Keep prepend blocks focused on what’s required for the example to run.
- Use separate prepend blocks per snippet name if imports differ across examples.
- Ensure your custom tag strings don’t collide with normal comment text.

