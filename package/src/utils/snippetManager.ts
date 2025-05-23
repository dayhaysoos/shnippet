interface SnippetConfig {
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
  outputDirectoryStructure?: "byLanguage" | "flat";
  version?: string;
  baseUrl?: string;
  supportedLanguages?: string[];
}

interface SnippetManager {
  getSnippet: (name: string, language: string) => Promise<string>;
  getSnippetDisplayInfo: (name: string) => {
    languages: string[];
    defaultLanguage: string;
    imports: Record<string, string[]>;
  };
  formatSnippet: (
    content: string,
    options: { language: string; showLineNumbers?: boolean }
  ) => string;
  preloadSnippets: (names: string[]) => Promise<void>;
  updateConfig: (config: Partial<SnippetConfig>) => void;
}

class SnippetManagerImpl implements SnippetManager {
  private cache: Map<string, string> = new Map();
  private config: SnippetConfig;

  constructor(config: Partial<SnippetConfig> = {}) {
    this.config = {
      baseUrl: "http://localhost:3000/snippets",
      supportedLanguages: ["python", "kotlin"],
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

  async preloadSnippets(names: string[]): Promise<void> {
    const languages = this.config.supportedLanguages || ["python", "kotlin"];
    for (const name of names) {
      for (const lang of languages) {
        await this.getSnippet(name, lang);
      }
    }
  }

  async getSnippet(name: string, language: string): Promise<string> {
    const key = `${name}-${language}`;

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    try {
      const url = `${this.config.baseUrl}/${language}/${name}.snippet.txt`;
      console.log("Fetching from:", url);
      const response = await fetch(url);
      console.log("Response status:", response.status);
      console.log("Response type:", response.type);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch snippet: ${name} for language: ${language}`
        );
      }

      const content = await response.text();
      console.log("Received content:", content);
      this.cache.set(key, content);
      return content;
    } catch (error) {
      console.error(
        `Error fetching snippet ${name} for language ${language}:`,
        error
      );
      throw error;
    }
  }

  getSnippetDisplayInfo(name: string) {
    const languages = this.config.supportedLanguages || ["python", "kotlin"];
    return {
      languages,
      defaultLanguage: languages[0],
      imports: {
        python: ["from typing import Any"],
        kotlin: ["import java.util.*"],
      },
    };
  }

  formatSnippet(
    content: string,
    options: { language: string; showLineNumbers?: boolean }
  ): string {
    if (!options.showLineNumbers) return content;

    return content
      .split("\n")
      .map((line, i) => `${i + 1} | ${line}`)
      .join("\n");
  }
}

// Create a default instance that can be configured later
export const snippetManager = new SnippetManagerImpl();
