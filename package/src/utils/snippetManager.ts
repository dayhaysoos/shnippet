export interface SnippetConfig {
  rootDirectory?: string;
  snippetOutputDirectory?: string;
  fileExtensions?: string[];
  exclude?: string[];
  snippetTags?: {
    start: string;
    end: string;
    prependStart: string;
    prependEnd: string;
  };
  outputDirectoryStructure?: 'byLanguage' | 'flat';
  version?: string;
  baseUrl?: string;
  supportedLanguages?: string[];
  defaultImports?: Record<string, string[]>;
}

interface SnippetResult {
  name: string;
  languages: string[];
  defaultLanguage: string;
  imports?: Record<string, string[]>;
  content: Record<string, string>;
}

interface SnippetManager {
  getSnippet: (name: string) => Promise<SnippetResult>;
  formatSnippet: (
    content: string,
    options: { language: string; showLineNumbers?: boolean }
  ) => string;
  updateConfig: (config: Partial<SnippetConfig>) => void;
}

class SnippetManagerImpl implements SnippetManager {
  private cache: Map<string, SnippetResult> = new Map();
  private config: SnippetConfig;
  private languageToDirectory: Record<string, string> = {
    python: 'py',
    typescript: 'ts',
    kotlin: 'kt',
    javascript: 'js',
  };

  constructor(config: Partial<SnippetConfig> = {}) {
    this.config = {
      baseUrl: 'http://localhost:3000/snippets',
      supportedLanguages: ['python', 'kotlin'],
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
    if (this.cache.has(name)) {
      return this.cache.get(name)!;
    }

    const languages = this.config.supportedLanguages || ['python', 'kotlin'];
    const content: Record<string, string> = {};
    const imports: Record<string, string[]> = {};

    // Use configured imports or defaults
    const defaultImports = this.config.defaultImports || {
      python: ['from typing import Any'],
      kotlin: ['import java.util.*'],
    };

    try {
      // Fetch content for each language
      for (const language of languages) {
        try {
          // Map language names to directory names
          const languageDir = this.languageToDirectory[language] || language;

          const url = `${this.config.baseUrl}/${languageDir}/${name}.snippet.txt`;
          const response = await fetch(url);

          if (response.ok) {
            content[language] = await response.text();
            // Only add imports if they exist for this language
            if (defaultImports[language]) {
              imports[language] = defaultImports[language];
            }
          }
        } catch (error) {
          console.error(`Error fetching ${language} snippet for ${name}:`, error);
        }
      }

      const result: SnippetResult = {
        name,
        languages: Object.keys(content),
        defaultLanguage: languages[0],
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
