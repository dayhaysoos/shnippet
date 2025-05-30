import path from 'path';
import { promises as fs } from 'fs';
import { generateSnippetTypes } from './typeGenerator';

type OutputStructure = 'flat' | 'match' | 'organized' | 'byLanguage';

interface SnippetExtractorConfig {
  rootDirectory: string;
  snippetOutputDirectory: string;
  fileExtensions: string[];
  exclude: string[];
  snippetTags: {
    start: string;
    end: string;
    prependStart: string;
    prependEnd: string;
  };
  outputDirectoryStructure: OutputStructure;
  version?: string;
  projectRoot?: string;
}

export class SnippetExtractor {
  private config: SnippetExtractorConfig;
  private prependBlocks: Record<string, string[]> = {};
  private projectRoot: string;
  private processedSnippets: Map<string, Set<string>> = new Map();
  private languageToDirectory: Record<string, string> = {
    python: 'py',
    typescript: 'ts',
    kotlin: 'kt',
    javascript: 'js',
  };

  constructor(config: SnippetExtractorConfig) {
    if (typeof window !== 'undefined') {
      throw new Error('SnippetExtractor can only be used in a Node.js environment');
    }

    this.validateConfig(config);
    this.config = {
      ...config,
      outputDirectoryStructure: config.outputDirectoryStructure || 'byLanguage',
    };
    this.projectRoot = config.projectRoot || process.cwd();
  }

  public getProjectRoot(): string {
    return this.projectRoot;
  }

  private validateConfig(config: SnippetExtractorConfig): void {
    if (!config.rootDirectory) throw new Error('rootDirectory is required');
    if (!config.snippetOutputDirectory) throw new Error('snippetOutputDirectory is required');
    if (!config.fileExtensions?.length) throw new Error('fileExtensions must not be empty');
    if (!config.snippetTags?.start || !config.snippetTags?.end) {
      throw new Error('snippetTags must include start and end tags');
    }
  }

  private gatherSnippetNames(content: string) {
    const { start, end } = this.config.snippetTags;
    let startIndex = 0,
      endIndex = 0;

    while ((startIndex = content.indexOf(start, startIndex)) !== -1) {
      endIndex = content.indexOf(end, startIndex);
      if (endIndex === -1) break;

      const snippetNameLine = content
        .substring(startIndex + start.length, content.indexOf('\n', startIndex))
        .trim();
      startIndex = endIndex + end.length;
    }
  }

  private gatherImports(content: string) {
    const { prependStart, prependEnd } = this.config.snippetTags;
    let startIndex = 0,
      endIndex = 0;

    while ((startIndex = content.indexOf(prependStart, startIndex)) !== -1) {
      const endOfStartTag = content.indexOf('\n', startIndex);
      const snippetNamesLine = content
        .substring(startIndex + prependStart.length, endOfStartTag)
        .trim();
      const snippetNames = snippetNamesLine.split(/\s+/); // Assuming space-separated names

      endIndex = content.indexOf(prependEnd, endOfStartTag);
      if (endIndex === -1) {
        break;
      }

      const importBlock = content
        .substring(endOfStartTag + 1, endIndex)
        .split('\n')
        .map((line) => {
          const trimmedLine = line.trimStart();
          if (trimmedLine.startsWith('//') || trimmedLine.startsWith('#')) {
            return '';
          }
          return line;
        })
        .filter((line) => line.trim() !== '')
        .join('\n')
        .trim();

      snippetNames.forEach((name) => {
        if (!this.prependBlocks[name]) {
          this.prependBlocks[name] = [];
        }
        this.prependBlocks[name].push(importBlock);
      });

      startIndex = endIndex + prependEnd.length;
    }
  }

  private extractSnippetsFromFile(content: string, filePath: string): Record<string, string> {
    const snippets: Record<string, string> = {};
    const lines = content.split('\n');
    let currentSnippet: string | null = null;
    let currentSnippetLines: string[] = [];
    let currentPrependBlock: string[] = [];
    const language = this.getLanguageFromExtension(path.extname(filePath));

    // Initialize the Set for this language if it doesn't exist
    if (!this.processedSnippets.has(language)) {
      this.processedSnippets.set(language, new Set());
    }

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const startTag = this.config.snippetTags.start;
      const endTag = this.config.snippetTags.end;

      // Simple comment stripping - just check for // or # at start
      const strippedLine =
        line.trimStart().startsWith('//') || line.trimStart().startsWith('#')
          ? line
              .trimStart()
              .slice(line.trimStart().startsWith('//') ? 2 : 1)
              .trimStart()
          : line;

      if (strippedLine.includes(startTag)) {
        const snippetName = this.extractSnippetName(strippedLine, startTag);
        if (!snippetName) {
          throw new Error(`Missing snippet name in file ${path.basename(filePath)}`);
        }

        if (this.processedSnippets.get(language)?.has(snippetName)) {
          continue;
        }

        currentSnippet = snippetName;
        currentSnippetLines = [];
        currentPrependBlock = this.prependBlocks[snippetName] || [];
        this.processedSnippets.get(language)?.add(snippetName);
      } else if (strippedLine.includes(endTag) && currentSnippet) {
        const normalizedContent = this.normalizeIndentation(currentSnippetLines);
        const prependContent =
          currentPrependBlock.length > 0 ? currentPrependBlock.join('\n') + '\n\n' : '';

        snippets[currentSnippet] = prependContent + normalizedContent;
        currentSnippet = null;
      } else if (currentSnippet) {
        currentSnippetLines.push(line);
      }
    }

    if (currentSnippet) {
      throw new Error(
        `Missing end tag for snippet '${currentSnippet}' in file ${path.basename(filePath)}`
      );
    }

    return snippets;
  }

  private extractSnippetName(line: string, startTag: string): string | null {
    const match = line.match(new RegExp(`${startTag}\\s*([^\\s]+)`));
    return match ? match[1].trim() : null;
  }

  private normalizeIndentation(lines: string[]): string {
    if (lines.length === 0) return '';

    // Find the minimum indentation
    const minIndent = lines.reduce((min, line) => {
      if (line.trim() === '') return min;
      const indent = line.match(/^\s*/)?.[0].length ?? 0;
      return Math.min(min, indent);
    }, Infinity);

    // Normalize indentation and strip comment markers
    return lines
      .map((line) => {
        const strippedLine = line.slice(minIndent);
        // Skip lines that are only comments
        if (strippedLine.trim() === '//' || strippedLine.trim() === '#') {
          return '';
        }
        // Strip comment markers if present
        return strippedLine.trimStart().startsWith('//') || strippedLine.trimStart().startsWith('#')
          ? strippedLine
              .trimStart()
              .slice(strippedLine.trimStart().startsWith('//') ? 2 : 1)
              .trimStart()
          : strippedLine;
      })
      .filter((line) => line.trim() !== '') // Remove empty lines
      .join('\n')
      .trim();
  }

  private shouldExcludeFile(filePath: string) {
    const fileName = path.basename(filePath);
    return this.config.exclude.some((excludeString) => fileName === excludeString);
  }

  public async processDirectory(directory: string, relativePath = ''): Promise<void> {
    const absoluteDir = path.resolve(this.projectRoot, directory);

    try {
      const items = await fs.readdir(absoluteDir);

      await Promise.all(
        items.map(async (item: string) => {
          const fullPath = path.join(absoluteDir, item);
          const stat = await fs.stat(fullPath);

          if (stat.isDirectory()) {
            await this.processDirectory(path.join(directory, item), path.join(relativePath, item));
          } else if (this.config.fileExtensions.includes(path.extname(item))) {
            const content = await fs.readFile(fullPath, 'utf-8');

            this.prependBlocks = {};
            this.gatherSnippetNames(content);
            this.gatherImports(content);

            if (!this.shouldExcludeFile(fullPath)) {
              const fileSnippets = this.extractSnippetsFromFile(content, fullPath);
              await this.writeSnippetsToFile(fileSnippets, fullPath, relativePath);
            }
          }
        })
      );
    } catch (error) {
      console.error(`Error processing directory ${directory}:`, error);
      throw error;
    }
  }

  private async writeSnippetsToFile(
    snippets: Record<string, string>,
    sourcePath: string,
    relativePath: string
  ): Promise<void> {
    if (Object.keys(snippets).length === 0) return;

    const outputDir = path.join(
      this.config.snippetOutputDirectory,
      ...(this.config.version ? [this.config.version] : []),
      this.getLanguageFromExtension(path.extname(sourcePath))
    );

    try {
      await fs.mkdir(outputDir, { recursive: true });

      for (const [snippetName, content] of Object.entries(snippets)) {
        const snippetPath = path.join(outputDir, `${snippetName}.snippet.txt`);
        await fs.writeFile(snippetPath, content, 'utf-8');
      }
    } catch (error) {
      console.error(`Error writing snippets to ${outputDir}:`, error);
      throw error;
    }
  }

  private getLanguageFromExtension(extension: string): string {
    const extensionToLanguageMap: Record<string, string> = {
      '.js': 'javascript',
      '.ts': 'typescript',
      '.kt': 'kotlin',
      '.py': 'python',
      '.swift': 'swift',
      '.gradle': 'gradle',
      '.bash': 'bash',
      '.xml': 'xml',
    };

    const language = extensionToLanguageMap[extension] || 'other';
    return this.languageToDirectory[language] || language;
  }

  public async extractSnippets(): Promise<void> {
    const absoluteOutputDir = path.resolve(this.projectRoot, this.config.snippetOutputDirectory);

    try {
      await fs.mkdir(absoluteOutputDir, { recursive: true });
      await this.processDirectory(this.config.rootDirectory);

      // After extracting snippets, generate types
      await generateSnippetTypes(this.config.rootDirectory, this.config.snippetOutputDirectory);
    } catch (error) {
      console.error('Error extracting snippets:', error);
      throw error;
    }
  }
}

export default SnippetExtractor;
