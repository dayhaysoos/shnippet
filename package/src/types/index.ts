export interface SnippetResult {
  name: string;
  languages: string[];
  defaultLanguage: string;
  imports?: Record<string, string[]>;
  content: Record<string, string>;
}

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

export interface SnippetManager {
  getSnippet(name: string): Promise<SnippetResult>;
  formatSnippet(content: string, options: { language: string; showLineNumbers?: boolean }): string;
  updateConfig(config: Partial<SnippetConfig>): void;
}
