import SnippetExtractor from "../src/extract/SnippetExtractor.js";

const extractor = new SnippetExtractor({
  rootDirectory: "./test",
  snippetOutputDirectory: "./snippets",
  fileExtensions: [".ts"],
  exclude: [],
  snippetTags: {
    start: ":snippet:",
    end: ":end:",
    prependStart: ":prepend-start:",
    prependEnd: ":prepend-end:",
  },
  outputDirectoryStructure: "byLanguage",
});

await extractor.extractSnippets();
