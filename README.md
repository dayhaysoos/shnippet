# Shnippet

Shnippet is a versatile code snippet extraction tool designed to help you manage and organize code snippets from your source files, particularly your test suites. It allows you to use your written tests as source code for content that gets surfaced in documentation.

## Features

- **Leverage Test Suites**: Use your existing tests as the source for documentation snippets.
- **Customizable Snippet Extraction**: Define custom tags to mark the start and end of code snippets.
- **Multi-Language Support**: Works with various programming languages by specifying file extensions.
- **Flexible Output Structure**: Choose how your snippets are organized in the output directory.
- **Prepend Blocks**: Include import statements or other code that should precede your snippets.
- **CLI Integration**: Use the command-line interface for easy integration into your build process.

## Installation

Install Shnippet as a dev dependency in your project:

```
npm install --save-dev shnippet
```

Or with pnpm:

```
pnpm add -D shnippet
```

## Getting Started

### Configuration

Create a `shnippet.config.ts` file in the root directory of your project:

```typescript
export const config = {
  rootDirectory: "./src", // Directory containing source files
  snippetOutputDirectory: "./snippets", // Directory to store extracted snippets
  fileExtensions: [".js", ".ts", ".kt", ".gradle", ".xml", ".bash", ".swift"], // Supported file types
  exclude: ["excludeThisSnippet"], // Snippets to exclude
  snippetTags: {
    start: ":snippet-start:",
    end: ":snippet-end:",
    prependStart: ":prepend-start:",
    prependEnd: ":prepend-end:",
  },
  outputDirectoryStructure: "byLanguage", // How snippets are organized
  version: "1.0.0", // Versioning for output directories
};
```

## Adding Snippets to Your Test Files

Mark the code you want to extract using the custom snippet tags defined in your configuration. By placing these tags in your test suites, you can directly extract code examples from your tests.

### Example in a TypeScript test file:

```typescript
// :snippet-start: exampleTestSnippet
test("should greet the user", () => {
  const name = "Alice";
  const greeting = greet(name);
  expect(greeting).toBe("Hello, Alice!");
});
// :snippet-end:
```

### Using Prepend Blocks

Include code that should be prepended to your snippets, such as import statements.

```typescript
// :prepend-start: exampleTestSnippet
import { greet } from "../src/greet";
// :prepend-end:
```

## Extracting Snippets

Use the Shnippet CLI to extract snippets based on your configuration.

### Running the Extractor

Add a script to your `package.json`:

```json
"scripts": {
  "shnippet": "shnippet --config ./shnippet.config.ts"
}
```

Then run:

```
npm run shnippet
```

Or with pnpm:

```
pnpm shnippet
```

## CLI Options

Shnippet provides several command-line options for additional control.

### Clear Output Directory

Remove all extracted snippets.

```
npm run shnippet -- clear
```

### Specify Output Structure

Choose how snippets are organized (`flat`, `match`, `organized`, `byLanguage`).

```
npm run shnippet -- --structure byLanguage
```

## Error Handling

Shnippet provides clear error messages for common issues when extracting snippets. Here are the main error cases and how to handle them:

### Missing End Tag

If a snippet is missing its end tag, Shnippet will throw an error with a descriptive message:

```
Error: Missing end tag for snippet 'example' in file example.js
```

### Missing Snippet Name

If a snippet start tag is missing its name, Shnippet will throw an error:

```
Error: Missing snippet name in file example.js
```

### Example of Proper Snippet Format

Here's an example of the correct format for snippets:

```javascript
// Correct format
//:snippet-start: hello-world
function hello() {
  console.log("Hello, world!");
}
//:snippet-end:

// Incorrect formats that will cause errors:
//:snippet-start:  // Missing name
function hello() {
  console.log("Hello, world!");
}
//:snippet-end:

//:snippet-start: hello-world
function hello() {
  console.log("Hello, world!");
}  // Missing end tag
```

## Configuration Options

- **`rootDirectory`**: Root directory containing the source files (e.g., your test suites).
- **`snippetOutputDirectory`**: Directory where snippets will be saved.
- **`fileExtensions`**: Array of file extensions to process.
- **`exclude`**: Array of snippet names to exclude from extraction.
- **`snippetTags`**: Custom tags to identify snippet boundaries.
  - `start`: Tag indicating the start of a snippet.
  - `end`: Tag indicating the end of a snippet.
  - `prependStart`: Tag indicating the start of a prepend block.
  - `prependEnd`: Tag indicating the end of a prepend block.
- **`outputDirectoryStructure`**: Determines how snippets are organized in the output directory.
- **`version`**: Version identifier used in the output directory path.

## Output Directory Structures

- **`flat`**: All snippets are placed in a single directory.
- **`match`**: Snippets mirror the directory structure of the source files.
- **`organized`**: Snippets are organized based on custom logic.
- **`byLanguage`**: Snippets are grouped by programming language (default).

## Examples

### Extracting and Using a Test Snippet

**Test File (`tests/greet.test.ts`):**

```typescript
// :prepend-start: greetTest
import { greet } from "../src/greet";
// :prepend-end:

// :snippet-start: greetTest
test("should greet the user", () => {
  const name = "Bob";
  const greeting = greet(name);
  expect(greeting).toBe("Hello, Bob!");
});
// :snippet-end:
```

**Extract Snippets:**

```
npm run shnippet
```

**Use Extracted Snippet in Documentation:**

The extracted snippets will be available in your `snippets` directory, organized by language. For example:

```
snippets/
  1.0.0/
    typescript/
      greetTest.snippet.txt
```

## Troubleshooting

### Unexpected Virtual Store Location Error

If you encounter an error regarding the virtual store location, reinstall your dependencies:

```
pnpm install
```

Alternatively, specify the virtual store directory in your `.npmrc` file:

```
virtual-store-dir = "node_modules/.pnpm"
```

## Displaying Snippets with SnippetManager

The snippet manager is a utility for fetching and displaying code snippets in your frontend application. It handles caching, language-specific formatting, and imports.

### Basic Usage

```typescript
import { snippetManager } from '@shnippet/core';

// Get a snippet in a specific language
const pythonCode = await snippetManager.getSnippet('my-snippet', 'python');

// Get display info (available languages and imports)
const info = snippetManager.getSnippetDisplayInfo('my-snippet');
// Returns: { 
//   languages: ['python', 'kotlin'],
//   defaultLanguage: 'python',
//   imports: { python: ['from typing import Any'] }
// }
```

### Configuration

**Note** You probably will never need to configure snippetManager, it's just available for edge-cases.

You can configure the snippet manager to match your needs. This allows you to overwrite your original snippet config settings.

```typescript
snippetManager.updateConfig({
  // Base URL for fetching snippets
  baseUrl: 'http://your-snippet-server.com/snippets',
  
  // Languages to support
  // Note: The first language in this array will be used as the defaultLanguage
  supportedLanguages: ['python', 'kotlin', 'typescript'],
  
  // Default imports for each language
  defaultImports: {
    python: ['from typing import Any'],
    kotlin: ['import java.util.*'],
    typescript: ['import { useState } from "react"']
  }
});
```

The snippet manager will cache the results, making subsequent fetches instant.

### Default Language Behavior

The `defaultLanguage` in the returned `SnippetResult` is always set to the first language in the `supportedLanguages` array. This means:

1. The order of languages in your `supportedLanguages` configuration determines which language is used as the default
2. This default is set regardless of whether the snippet exists in that language
3. You can control the default language by reordering the `supportedLanguages` array

For example, if you want Kotlin to be the default language, put it first in the array:
```typescript
snippetManager.updateConfig({
  supportedLanguages: ['kotlin', 'python', 'typescript']  // Kotlin will be the default
});
```
