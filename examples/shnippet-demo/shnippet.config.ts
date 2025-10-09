export const config = {
  rootDirectory: './tests',
  snippetOutputDirectory: './snippets',
  fileExtensions: ['.ts', '.py'],
  exclude: [],
  snippetTags: {
    start: ':snippet-start:',
    end: ':snippet-end:',
    prependStart: ':prepend-start:',
    prependEnd: ':prepend-end:',
  },
  outputDirectoryStructure: 'byLanguage',
};
