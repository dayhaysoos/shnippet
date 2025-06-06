export const config = {
    rootDirectory: "./tests",
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
    supportedLanguages: ["typescript"]
};
