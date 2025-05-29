import { snippetManager } from '../../src/utils/snippetManager';
import { describe, expect, it, beforeEach, vi } from 'vitest';
import path from 'path';
import fs from 'fs/promises';

describe('SnippetManager', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve("print('Hello, world!')"),
      } as Response)
    );
    snippetManager.updateConfig({
      exclude: ['**/malformed/**', '**/missing-name/**'],
      supportedLanguages: ['python'],
    });
  });

  it('Can get a snippet for a single language', async () => {
    const snippet = await snippetManager.getSnippet('test');
    expect(snippet.content.python).toBe("print('Hello, world!')");
  });

  it('Returns a complete SnippetResult object', async () => {
    // Update config to support multiple languages
    snippetManager.updateConfig({
      supportedLanguages: ['python', 'typescript', 'kotlin'],
    });

    // Mock fetch to return different content for each language
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/py/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("print('Hello, world!')"),
        } as Response);
      }
      if (url.includes('/ts/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("console.log('Hello, world!')"),
        } as Response);
      }
      if (url.includes('/kt/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("println('Hello, world!')"),
        } as Response);
      }
      return Promise.reject(new Error('Unknown language'));
    });

    const result = await snippetManager.getSnippet('example1');

    // Test the complete structure
    expect(result).toEqual({
      name: 'example1',
      languages: ['python', 'typescript', 'kotlin'],
      defaultLanguage: 'python',
      content: {
        python: "print('Hello, world!')",
        typescript: "console.log('Hello, world!')",
        kotlin: "println('Hello, world!')",
      },
      imports: {
        python: ['from typing import Any'],
        kotlin: ['import java.util.*'],
      },
    });

    // Test that all required properties exist
    expect(result).toHaveProperty('name');
    expect(result).toHaveProperty('languages');
    expect(result).toHaveProperty('defaultLanguage');
    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('imports');

    // Test that languages array matches content keys
    expect(result.languages).toEqual(Object.keys(result.content));
  });

  it('Can update config and clear cache', async () => {
    // First, fetch a snippet to populate cache
    await snippetManager.getSnippet('test');
    expect(snippetManager['cache'].size).toBe(1);

    // Update config with new settings
    const newConfig = {
      baseUrl: 'http://new-url.com/snippets',
      supportedLanguages: ['typescript'],
      exclude: ['**/malformed/**', '**/missing-name/**', '**/new-exclude/**'],
    };
    snippetManager.updateConfig(newConfig);

    // Verify cache is cleared
    expect(snippetManager['cache'].size).toBe(0);

    // Verify new config is applied
    expect(snippetManager['config'].baseUrl).toBe(newConfig.baseUrl);
    expect(snippetManager['config'].supportedLanguages).toEqual(newConfig.supportedLanguages);
    expect(snippetManager['config'].exclude).toEqual(newConfig.exclude);
  });

  it('Caches snippet results and reuses them', async () => {
    // First call should make a network request
    await snippetManager.getSnippet('example1');
    expect(global.fetch).toHaveBeenCalledTimes(1);

    // Reset the fetch mock to verify it's not called again
    vi.clearAllMocks();

    // Second call should use cache
    const snippet = await snippetManager.getSnippet('example1');
    expect(snippet.content.python).toBe("print('Hello, world!')");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('Fetches all languages at once and caches them', async () => {
    // Update config to support multiple languages
    snippetManager.updateConfig({
      supportedLanguages: ['python', 'typescript', 'kotlin'],
    });

    // First call should make a network request for each language
    const snippet = await snippetManager.getSnippet('example1');
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(snippet.content).toHaveProperty('python');
    expect(snippet.content).toHaveProperty('typescript');
    expect(snippet.content).toHaveProperty('kotlin');

    // Reset the fetch mock
    vi.clearAllMocks();

    // Second call should use cache
    const cachedSnippet = await snippetManager.getSnippet('example1');
    expect(cachedSnippet.content).toEqual(snippet.content);
    expect(global.fetch).not.toHaveBeenCalled();

    // Cache should have one entry with all languages
    expect(snippetManager['cache'].size).toBe(1);
  });

  it('Uses first supported language as defaultLanguage', async () => {
    // Test with different language orders
    const languageOrders = [
      ['python', 'typescript', 'kotlin'],
      ['kotlin', 'python', 'typescript'],
      ['typescript', 'kotlin', 'python'],
    ];

    for (const languages of languageOrders) {
      // Update config with new language order
      snippetManager.updateConfig({
        supportedLanguages: languages,
      });

      // Get snippet and verify defaultLanguage
      const result = await snippetManager.getSnippet('example1');
      expect(result.defaultLanguage).toBe(languages[0]);
    }
  });

  it('Handles missing languages gracefully', async () => {
    // Mock fetch to fail for typescript
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('ts')) {
        return Promise.reject(new Error('Not found'));
      }
      return Promise.resolve({
        ok: true,
        text: () => Promise.resolve("print('Hello, world!')"),
      } as Response);
    });

    snippetManager.updateConfig({
      supportedLanguages: ['python', 'typescript', 'kotlin'],
    });

    const result = await snippetManager.getSnippet('example1');

    // Should still return a valid result with available languages
    expect(result.languages).not.toContain('typescript');
    expect(result.content).not.toHaveProperty('typescript');
    expect(result.languages).toEqual(Object.keys(result.content));
  });

  it('Handles imports correctly', async () => {
    // Mock fetch to return different content for each language
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/py/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("print('Hello, world!')"),
        } as Response);
      }
      if (url.includes('/ts/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("console.log('Hello, world!')"),
        } as Response);
      }
      if (url.includes('/kt/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("println('Hello, world!')"),
        } as Response);
      }
      return Promise.reject(new Error('Unknown language'));
    });

    // Configure with custom imports
    snippetManager.updateConfig({
      supportedLanguages: ['python', 'typescript', 'kotlin'],
      defaultImports: {
        python: ['from typing import Any', 'import sys'],
        typescript: ['import { useState } from "react"'],
        kotlin: ['import java.util.*'],
      },
    });

    const result = await snippetManager.getSnippet('example1');

    // Verify imports are included correctly
    expect(result.imports).toBeDefined();
    expect(result.imports?.python).toEqual(['from typing import Any', 'import sys']);
    expect(result.imports?.typescript).toEqual(['import { useState } from "react"']);
    expect(result.imports?.kotlin).toEqual(['import java.util.*']);
  });

  it('Clears cache when config changes', async () => {
    // First fetch
    await snippetManager.getSnippet('example1');
    expect(snippetManager['cache'].size).toBe(1);

    // Change baseUrl
    snippetManager.updateConfig({
      baseUrl: 'http://new-url.com/snippets',
    });
    expect(snippetManager['cache'].size).toBe(0);

    // Change supportedLanguages
    await snippetManager.getSnippet('example1');
    expect(snippetManager['cache'].size).toBe(1);
    snippetManager.updateConfig({
      supportedLanguages: ['kotlin', 'python'],
    });
    expect(snippetManager['cache'].size).toBe(0);

    // Change defaultImports
    await snippetManager.getSnippet('example1');
    expect(snippetManager['cache'].size).toBe(1);
    snippetManager.updateConfig({
      defaultImports: { python: ['new import'] },
    });
    expect(snippetManager['cache'].size).toBe(0);
  });

  it('Handles language-specific content correctly', async () => {
    // Mock fetch to return language-specific content
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/py/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("print('Python content')"),
        } as Response);
      }
      if (url.includes('/ts/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("console.log('TypeScript content')"),
        } as Response);
      }
      if (url.includes('/kt/')) {
        return Promise.resolve({
          ok: true,
          text: () => Promise.resolve("println('Kotlin content')"),
        } as Response);
      }
      return Promise.reject(new Error('Unknown language'));
    });

    snippetManager.updateConfig({
      supportedLanguages: ['python', 'typescript', 'kotlin'],
    });

    const result = await snippetManager.getSnippet('example1');

    // Verify each language has its specific content
    expect(result.content.python).toBe("print('Python content')");
    expect(result.content.typescript).toBe("console.log('TypeScript content')");
    expect(result.content.kotlin).toBe("println('Kotlin content')");
  });
});
