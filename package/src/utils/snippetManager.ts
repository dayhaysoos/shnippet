import { getSnippet } from "../helpers/getSnippet.js";

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
}

class SnippetManagerImpl implements SnippetManager {
  private cache: Map<string, string> = new Map();
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:3000/snippets") {
    this.baseUrl = baseUrl;
  }

  async preloadSnippets(names: string[]): Promise<void> {
    const languages = ["python", "kotlin"]; // This should come from config
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
      const response = await fetch(
        `${this.baseUrl}/${language}/${name}.snippet.js`
      );
      if (!response.ok) {
        throw new Error(
          `Failed to fetch snippet: ${name} for language: ${language}`
        );
      }
      const text = await response.text();
      console.log("Raw snippet text:", text);

      // Extract the default export from the module
      const match = text.match(/export default (.*);/);
      console.log("Match result:", match);

      if (!match) {
        throw new Error(`Invalid snippet format for ${name}`);
      }

      // Parse the content, handling both string and JSON formats
      let content: string;
      try {
        // First try parsing as JSON (for backward compatibility)
        content = JSON.parse(match[1]);
        console.log("Parsed as JSON:", content);
      } catch (e) {
        // If that fails, use the string directly (removing quotes)
        content = match[1].replace(/^["']|["']$/g, "");
        console.log("Parsed as string:", content);
      }

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
    // This would normally read from a config or metadata file
    // For now, return hardcoded info for example1
    return {
      languages: ["python", "kotlin"],
      defaultLanguage: "python",
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

export const snippetManager = new SnippetManagerImpl();
