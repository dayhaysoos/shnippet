export const config = {
  rootDirectory: "./test",
  snippetOutputDirectory: "./snippets",
  fileExtensions: [".js", ".ts", ".kt", ".gradle", ".xml", ".bash", ".swift", ".py"],
  exclude: [],
  snippetTags: {
    start: ":snippet-start:",
    end: ":snippet-end:",
    prependStart: ":prepend-start:",
    prependEnd: ":prepend-end:",
  },
  outputDirectoryStructure: "byLanguage",
  baseUrl: "http://localhost:3000",
  supportedLanguages: ["python", "kotlin", "javascript"]
};
