import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';

export async function generateSnippetTypes(
  rootDirectory: string,
  outputDir: string
): Promise<void> {
  // Find all files that might contain snippets
  const files = await glob('**/*.{js,ts,jsx,tsx,py,kt}', {
    cwd: rootDirectory,
    ignore: ['**/node_modules/**', '**/dist/**'],
    absolute: true,
  });

  const snippets = new Set<string>();

  // Extract snippet names from each file
  for (const file of files) {
    const content = await fs.readFile(file, 'utf-8');
    const lines = content.split('\n');

    for (const line of lines) {
      const match = line.match(/:snippet-start:\s*(\w+)/);
      if (match) {
        snippets.add(match[1]);
      }
    }
  }

  // Generate the types file
  const typeContent = `/**
 * This file is auto-generated. Do not edit manually.
 * Generated from snippet tags in your codebase.
 */

export type SnippetName = ${Array.from(snippets)
    .map((s) => `'${s}'`)
    .join(' | ')};
`;

  // Create gen-types directory if it doesn't exist
  const genTypesDir = path.join(outputDir, 'gen-types');
  await fs.mkdir(genTypesDir, { recursive: true });

  // Write the types file as index.d.ts
  await fs.writeFile(path.join(genTypesDir, 'index.d.ts'), typeContent, 'utf-8');
}
