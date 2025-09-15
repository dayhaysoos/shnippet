import SnippetExtractor from './extract/SnippetExtractor';
import { snippetManager } from './utils/snippetManager';
import type { SnippetResult, SnippetConfig } from './types/index';

// Export everything - the build process will handle which version to use
export { SnippetExtractor, snippetManager };
export type { SnippetResult, SnippetConfig };
