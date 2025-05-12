export const config = {
  rootDirectory: "./src",
  snippetOutputDirectory: "./snippets",
  fileExtensions: [".js", ".ts", ".kt", ".gradle", ".xml", ".bash", ".swift"],
  exclude: [],
  snippetTags: {
    start: ":snippet-start:",
    end: ":snippet-end:",
    prependStart: ":prepend-start:",
    prependEnd: ":prepend-end:",
  },
  outputDirectoryStructure: "byLanguage",
  version: "1.0.0",
};
