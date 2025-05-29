import { describe, it, expect, beforeAll } from 'vitest';
import { SnippetExtractor } from '../../src/extract/SnippetExtractor';
import path from 'path';
import { promises as fs } from 'fs';

const config = {
  rootDirectory: 'test/__fixtures__',
  snippetOutputDirectory: 'snippets',
  fileExtensions: ['.js', '.ts', '.py', '.kt'],
  exclude: ['node_modules', 'dist'],
  snippetTags: {
    start: ':snippet-start:',
    end: ':snippet-end:',
    prependStart: ':prepend-start:',
    prependEnd: ':prepend-end:',
  },
  outputDirectoryStructure: 'byLanguage' as const,
  projectRoot: process.cwd(),
};

describe('SnippetExtractor', () => {
  describe('config validation', () => {
    it('should accept a valid config', () => {
      expect(() => new SnippetExtractor(config)).not.toThrow();
    });

    it('should throw when rootDirectory is missing', () => {
      const invalidConfig = { ...config, rootDirectory: '' };
      expect(() => new SnippetExtractor(invalidConfig)).toThrow('rootDirectory is required');
    });

    it('should throw when snippetOutputDirectory is missing', () => {
      const invalidConfig = { ...config, snippetOutputDirectory: '' };
      expect(() => new SnippetExtractor(invalidConfig)).toThrow(
        'snippetOutputDirectory is required'
      );
    });

    it('should throw when fileExtensions is empty', () => {
      const invalidConfig = { ...config, fileExtensions: [] };
      expect(() => new SnippetExtractor(invalidConfig)).toThrow('fileExtensions must not be empty');
    });

    it('should throw when snippetTags.start is missing', () => {
      const invalidConfig = {
        ...config,
        snippetTags: { ...config.snippetTags, start: '' },
      };
      expect(() => new SnippetExtractor(invalidConfig)).toThrow(
        'snippetTags must include start and end tags'
      );
    });

    it('should throw when snippetTags.end is missing', () => {
      const invalidConfig = {
        ...config,
        snippetTags: { ...config.snippetTags, end: '' },
      };
      expect(() => new SnippetExtractor(invalidConfig)).toThrow(
        'snippetTags must include start and end tags'
      );
    });
  });

  describe('valid snippets', () => {
    let extractor: SnippetExtractor;

    beforeAll(async () => {
      // Clean up any existing snippets
      const absoluteOutputDir = path.resolve(process.cwd(), config.snippetOutputDirectory);
      try {
        await fs.rm(absoluteOutputDir, { recursive: true, force: true });
      } catch (error) {
        // Ignore if directory doesn't exist
      }

      // Create a new config that excludes the malformed file
      const validConfig = {
        ...config,
        exclude: [...config.exclude, 'malformed.js', 'missing-name.js'],
      };
      extractor = new SnippetExtractor(validConfig);
      await extractor.extractSnippets();
    });

    describe('extractSnippets', () => {
      it('should create directories for each language', async () => {
        const absoluteOutputDir = path.resolve(
          extractor.getProjectRoot(),
          config.snippetOutputDirectory
        );

        const items = await fs.readdir(absoluteOutputDir);
        expect(items).toContain('ts');
        expect(items).toContain('js');
        expect(items).toContain('py');
        expect(items).toContain('kt');
      });

      it('should create files with correct names in each language directory', async () => {
        const absoluteOutputDir = path.resolve(
          extractor.getProjectRoot(),
          config.snippetOutputDirectory
        );

        // Check TypeScript snippets
        const tsDir = path.join(absoluteOutputDir, 'ts');
        const tsFiles = await fs.readdir(tsDir);
        expect(tsFiles).toContain('example1.snippet.txt');
        expect(tsFiles).toContain('example2.snippet.txt');

        // Check Kotlin snippets
        const ktDir = path.join(absoluteOutputDir, 'kt');
        const ktFiles = await fs.readdir(ktDir);
        expect(ktFiles).toContain('example1.snippet.txt');
        expect(ktFiles).toContain('example2.snippet.txt');

        // Check Python snippets
        const pyDir = path.join(absoluteOutputDir, 'py');
        const pyFiles = await fs.readdir(pyDir);
        expect(pyFiles).toContain('example1.snippet.txt');
        expect(pyFiles).toContain('example2.snippet.txt');
      });

      it('should extract content correctly from source files', async () => {
        const normalizeContent = (content: string): string => {
          return content
            .replace(/\s+/g, '') // Remove all whitespace
            .toLowerCase(); // Convert to lowercase
        };

        const extractContentFromSource = (
          content: string,
          startTag: string,
          endTag: string
        ): string => {
          // Find the start tag and get the content after it
          const startIndex = content.indexOf(startTag) + startTag.length;
          // Find the end tag
          const endIndex = content.indexOf(endTag);
          // Get the content and trim it
          const rawContent = content.slice(startIndex, endIndex).trim();
          // Remove any comment markers at the start of each line
          return rawContent
            .split('\n')
            .map((line) => {
              // First remove any comment markers
              const withoutComments = line.replace(/^[\s]*[\/#]+\s*/, '').trim();
              // Then remove the snippet name if it's at the start of the first line
              if (line === rawContent.split('\n')[0]) {
                return withoutComments.replace(/^[a-z0-9-]+\s*/, '').trim();
              }
              return withoutComments;
            })
            .join('\n')
            .trim();
        };

        // Test TypeScript content
        const tsSource = await fs.readFile(
          path.join(process.cwd(), config.rootDirectory, 'example.ts'),
          'utf-8'
        );
        const tsSnippet = await fs.readFile(
          path.join(process.cwd(), config.snippetOutputDirectory, 'ts', 'example1.snippet.txt'),
          'utf-8'
        );

        const tsSourceContent = extractContentFromSource(
          tsSource,
          config.snippetTags.start,
          config.snippetTags.end
        );
        expect(normalizeContent(tsSnippet)).toBe(normalizeContent(tsSourceContent));
      });
    });
  });

  describe('error handling', () => {
    it('should throw an error when a snippet is missing its end tag', async () => {
      const extractor = new SnippetExtractor({
        ...config,
        exclude: [...config.exclude, 'missing-name.js'],
      });
      await expect(extractor.extractSnippets()).rejects.toThrow(
        "Missing end tag for snippet 'malformed' in file malformed.js"
      );
    });

    it('should throw an error when a snippet is missing its name', async () => {
      const testConfig = {
        ...config,
        exclude: [...config.exclude, 'malformed.js'],
      };
      const extractor = new SnippetExtractor(testConfig);
      await expect(extractor.extractSnippets()).rejects.toThrow(
        'Missing snippet name in file missing-name.js'
      );
    });
  });
});
