# Shnip

Shnip is a versatile code snippet extraction tool designed to help you manage and organize code snippets from your source files, particularly your test suites. It allows you to use your written tests as source code for content that gets surfaced in documentation.

## Features

- **Leverage Test Suites**: Use your existing tests as the source for documentation snippets.
- **Customizable Snippet Extraction**: Define custom tags to mark the start and end of code snippets.
- **Multi-Language Support**: Works with various programming languages by specifying file extensions.
- **Flexible Output Structure**: Choose how your snippets are organized in the output directory.
- **Prepend Blocks**: Include import statements or other code that should precede your snippets.
- **CLI Integration**: Use the command-line interface for easy integration into your build process.

## Installation

Install Shnip using npm:

```
npm install shnip
```

Or with pnpm:

```
pnpm install shnip
```

## Getting Started

### Configuration

Create a `shnip.config.ts` file in the root directory of your project:

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

Use the Shnip CLI to extract snippets based on your configuration.

### Running the Extractor

```
npx shnip
```

Or add a script to your `package.json`:

```json
"scripts": {
  "extract-snippets": "shnip"
}
```

Then run:

```
npm run extract-snippets
```

## Using Extracted Snippets in Documentation

Import the extracted snippets into your documentation or application.

### Example in a React Component for Documentation:

```jsx
import exampleTestSnippet from "./snippets/1.0.0/typescript/exampleTestSnippet.snippet.js";

function Documentation() {
  return <CodeBlock language="typescript">{exampleTestSnippet}</CodeBlock>;
}
```

## CLI Options

Shnip provides several command-line options for additional control.

### Clear Output Directory

Remove all extracted snippets.

```
npx shnip clear
```

### Specify Output Structure

Choose how snippets are organized (`flat`, `match`, `organized`, `byLanguage`).

```
npx shnip --structure byLanguage
```

## API Reference

### `SnippetExtractor` Class

Main class responsible for extracting snippets.

**Importing:**

```typescript
import { SnippetExtractor } from "shnip";
```

**Usage:**

```typescript
const extractor = new SnippetExtractor(config);
extractor.extractSnippets();
```

### `getSnippet` Function

Asynchronously retrieves a snippet's content.

**Importing:**

```typescript
import { getSnippet } from "shnip";
```

**Usage:**

```typescript
const snippetContent = await getSnippet("exampleTestSnippet", "typescript");
```

**Parameters:**

- `snippetName` (string): The name of the snippet to retrieve.
- `language` (string): The programming language of the snippet (default is `'javascript'`).

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
npx shnip
```

**Use Extracted Snippet in Documentation:**

```jsx
import greetTest from "./snippets/1.0.0/typescript/greetTest.snippet.js";

function GreetTestDocs() {
  return <CodeBlock language="typescript">{greetTest}</CodeBlock>;
}
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

### Linking Issues

To link `shnip` as a local package:

```
pnpm link --dir ./example
```

Or add it as a dependency in your `package.json` using a relative path:

```json
"dependencies": {
  "shnip": "file:../shnip"
}
```
