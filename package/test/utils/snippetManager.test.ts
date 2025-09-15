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
      fileExtensions: ['py'],
    });
  });

  it('Can get a snippet for a single language', async () => {
    const snippet = await snippetManager.getSnippet('test');
    expect(snippet.content.py).toBe("print('Hello, world!')");
  });

  it('Returns a complete SnippetResult object', async () => {
    // Update config to support multiple languages
    snippetManager.updateConfig({
      fileExtensions: ['py', 'ts', 'kt'],
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
      languages: ['py', 'ts', 'kt'],
      defaultLanguage: 'py',
      content: {
        py: "print('Hello, world!')",
        ts: "console.log('Hello, world!')",
        kt: "println('Hello, world!')",
      },
      imports: {
        py: ['from typing import Any'],
        kt: ['import java.util.*'],
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
      fileExtensions: ['ts'],
      exclude: ['**/malformed/**', '**/missing-name/**', '**/new-exclude/**'],
    };
    snippetManager.updateConfig(newConfig);

    // Verify cache is cleared
    expect(snippetManager['cache'].size).toBe(0);

    // Verify new config is applied
    expect(snippetManager['config'].baseUrl).toBe(newConfig.baseUrl);
    expect(snippetManager['config'].fileExtensions).toEqual(newConfig.fileExtensions);
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
    expect(snippet.content.py).toBe("print('Hello, world!')");
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('Fetches all languages at once and caches them', async () => {
    // Update config to support multiple languages
    snippetManager.updateConfig({
      fileExtensions: ['py', 'ts', 'kt'],
    });

    // First call should make a network request for each language
    const snippet = await snippetManager.getSnippet('example1');
    expect(global.fetch).toHaveBeenCalledTimes(3);
    expect(snippet.content).toHaveProperty('py');
    expect(snippet.content).toHaveProperty('ts');
    expect(snippet.content).toHaveProperty('kt');

    // Reset the fetch mock
    vi.clearAllMocks();

    // Second call should use cache
    const cachedSnippet = await snippetManager.getSnippet('example1');
    expect(cachedSnippet.content).toEqual(snippet.content);
    expect(global.fetch).not.toHaveBeenCalled();

    // Cache should have one entry with all languages
    expect(snippetManager['cache'].size).toBe(1);
  });

  it('Uses first file extension as defaultLanguage', async () => {
    // Test with different language orders
    const languageOrders = [
      ['py', 'ts', 'kt'],
      ['kt', 'py', 'ts'],
      ['ts', 'kt', 'py'],
    ];

    for (const languages of languageOrders) {
      // Update config with new language order
      snippetManager.updateConfig({
        fileExtensions: languages,
      });

      // Get snippet and verify defaultLanguage
      const result = await snippetManager.getSnippet('example1');
      expect(result.defaultLanguage).toBe(languages[0]);
    }
  });

  it('Handles missing languages gracefully', async () => {
    // Mock fetch to fail for ts
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
      fileExtensions: ['py', 'ts', 'kt'],
    });

    const result = await snippetManager.getSnippet('example1');

    // Should still return a valid result with available languages
    expect(result.languages).not.toContain('ts');
    expect(result.content).not.toHaveProperty('ts');
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
      fileExtensions: ['py', 'ts', 'kt'],
      defaultImports: {
        py: ['from typing import Any', 'import sys'],
        ts: ['import { useState } from "react"'],
        kt: ['import java.util.*'],
      },
    });

    const result = await snippetManager.getSnippet('example1');

    // Verify imports are included correctly
    expect(result.imports).toBeDefined();
    expect(result.imports?.py).toEqual(['from typing import Any', 'import sys']);
    expect(result.imports?.ts).toEqual(['import { useState } from "react"']);
    expect(result.imports?.kt).toEqual(['import java.util.*']);
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

    // Change fileExtensions
    await snippetManager.getSnippet('example1');
    expect(snippetManager['cache'].size).toBe(1);
    snippetManager.updateConfig({
      fileExtensions: ['kt', 'py'],
    });
    expect(snippetManager['cache'].size).toBe(0);

    // Change defaultImports
    await snippetManager.getSnippet('example1');
    expect(snippetManager['cache'].size).toBe(1);
    snippetManager.updateConfig({
      defaultImports: { py: ['new import'] },
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
      fileExtensions: ['py', 'ts', 'kt'],
    });

    const result = await snippetManager.getSnippet('example1');

    // Verify each language has its specific content
    expect(result.content.py).toBe("print('Python content')");
    expect(result.content.ts).toBe("console.log('TypeScript content')");
    expect(result.content.kt).toBe("println('Kotlin content')");
  });
});
