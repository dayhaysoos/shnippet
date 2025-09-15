import { SnippetResult, SnippetManager, SnippetConfig } from '../types/index';

class SnippetManagerImpl implements SnippetManager {
  private cache: Map<string, SnippetResult> = new Map();
  private config: SnippetConfig;

  private normalizeToExtKey(id: string): string {
    const trimmed = id.trim().toLowerCase();
    const withoutDot = trimmed.startsWith('.') ? trimmed.slice(1) : trimmed;
    return withoutDot; // treat value as the directory/key (e.g., ts, kt, py, swift)
  }

  constructor(config: Partial<SnippetConfig> = {}) {
    this.config = {
      baseUrl: '/snippets',
      ...config,
    };
  }

  updateConfig(newConfig: Partial<SnippetConfig>) {
    this.config = {
      ...this.config,
      ...newConfig,
    };
    // Clear cache when config changes
    this.cache.clear();
  }

  async getSnippet(name: string): Promise<SnippetResult> {
    // Debug: surface current runtime config
    try {
      // eslint-disable-next-line no-console
      console.log('[shnippet] snippetManager config:', this.config);
    } catch {}
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    let { fileExtensions } = this.config as { fileExtensions?: string[] };
    // If not provided, try to auto-load from /snippets/config.json once
    if (!fileExtensions || fileExtensions.length === 0) {
      try {
        const res = await fetch(`${this.config.baseUrl}/config.json`);
        if (res.ok) {
          const cfg = await res.json();
          if (Array.isArray(cfg.fileExtensions)) {
            fileExtensions = cfg.fileExtensions as string[];
            this.updateConfig({ fileExtensions });
          }
        }
      } catch {}
    }
    if (!fileExtensions || fileExtensions.length === 0) {
      throw new Error('shnippet: fileExtensions is required (set in shnippet.config or runtime)');
    }
    // Normalize configured identifiers to extension keys (e.g., 'python' → 'py', '.ts' → 'ts')
    const extKeys = fileExtensions.map((id) => this.normalizeToExtKey(id));
    const content: Record<string, string> = {};
    const imports: Record<string, string[]> = {};

    // Use configured imports or defaults
    const rawImports = this.config.defaultImports || {
      py: ['from typing import Any'],
      kt: ['import java.util.*'],
    };
    // Normalize import map keys to extension keys
    const defaultImports: Record<string, string[]> = {};
    for (const key of Object.keys(rawImports)) {
      defaultImports[this.normalizeToExtKey(key)] = rawImports[key];
    }

    try {
      // Fetch content for each configured extension key
      for (const extKey of extKeys) {
        try {
          const url = `${this.config.baseUrl}/${extKey}/${name}.snippet.txt`;
          try {
            // eslint-disable-next-line no-console
            console.log('[shnippet] fetching snippet URL:', url);
          } catch {}
          const response = await fetch(url);

          if (response.ok) {
            content[extKey] = await response.text();
            // Only add imports if they exist for this language
            if (defaultImports[extKey]) {
              imports[extKey] = defaultImports[extKey];
            }
          }
        } catch (error) {
          console.error(`Error fetching ${extKey} snippet for ${name}:`, error);
        }
      }

      const result: SnippetResult = {
        name,
        languages: Object.keys(content),
        // Default to the first configured extension key to reduce friction
        defaultLanguage: extKeys[0],
        content,
        // Only include imports if we have any
        ...(Object.keys(imports).length > 0 && { imports }),
      };

      this.cache.set(name, result);
      return result;
    } catch (error) {
      console.error(`Error fetching snippet ${name}:`, error);
      throw error;
    }
  }

  formatSnippet(content: string, options: { language: string; showLineNumbers?: boolean }): string {
    if (!options.showLineNumbers) return content;

    return content
      .split('\n')
      .map((line, i) => `${i + 1} | ${line}`)
      .join('\n');
  }
}

// Create a default instance that can be configured later
export const snippetManager = new SnippetManagerImpl();
