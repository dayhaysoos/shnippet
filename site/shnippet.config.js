module.exports = {
    rootDirectory: "./tests",
    snippetOutputDirectory: "./static/snippets",
    fileExtensions: [".js", ".ts", ".kt", ".gradle", ".xml", ".bash", ".swift", ".py"],
    exclude: [],
    snippetTags: {
        start: ":snippet-start:",
        end: ":snippet-end:",
        prependStart: ":prepend-start:",
        prependEnd: ":prepend-end:",
    },
    outputDirectoryStructure: "byLanguage",
    baseUrl: "/snippets",
    fileExtensions: [".ts"]
};
