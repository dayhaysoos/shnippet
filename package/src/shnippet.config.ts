export const config = {
  rootDirectory: './site-new/testsuites',
  snippetOutputDirectory: './site-new/snippets',
  fileExtensions: ['.js', '.ts', '.kt', '.gradle', '.xml', '.bash', '.swift'],
  exclude: ['pfiOverviewReadOfferingsJs', 'pfiOverviewWriteJs', 'pfiOverviewWriteOfferingsJs'],
  snippetTags: {
    start: ':snippet-start:',
    end: ':snippet-end:',
    prependStart: ':prepend-start:',
    prependEnd: ':prepend-end:',
  },
  outputDirectoryStructure: 'byLanguage',
  version: '1.0.0',
};
