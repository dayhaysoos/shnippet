import React, { useState, useEffect } from 'react';
import { snippetManager } from 'shnippet';
import { config } from '../shnippet.config';
import type { SnippetResult } from 'shnippet';
import type { SnippetName } from '../snippets/gen-types';


// Update the snippetManager with our config
snippetManager.updateConfig(config);

function App() {
  const [snippetResult, setSnippetResult] = useState<SnippetResult | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    async function loadSnippet() {
      try {
        // Try to load a test snippet
        const result = await snippetManager.getSnippet('example1' as SnippetName);

        setSnippetResult(result);
        // Set initial language to the default language
        setSelectedLanguage(result.defaultLanguage);
      } catch (err) {
        setError(err.message);
      }
    }
    loadSnippet();
  }, []);

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Shnippet Test</h1>
        <div style={{ color: 'red' }}>Error: {error}</div>
      </div>
    );
  }

  if (!snippetResult) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Shnippet Test</h1>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Shnippet Test</h1>

      {/* Language Tabs */}
      <div style={{ marginBottom: '20px' }}>
        {snippetResult.languages.map((language) => (
          <button
            key={language}
            onClick={() => setSelectedLanguage(language)}
            style={{
              padding: '8px 16px',
              marginRight: '8px',
              border: 'none',
              background: selectedLanguage === language ? '#007bff' : '#f0f0f0',
              color: selectedLanguage === language ? 'white' : 'black',
              cursor: 'pointer',
              borderRadius: '4px',
            }}
          >
            {language}
          </button>
        ))}
      </div>

      {/* Code Display */}
      {snippetResult.imports?.[selectedLanguage] && (
        <div>
          <h3>Imports:</h3>
          <pre
            style={{
              background: '#f5f5f5',
              padding: '15px',
              borderRadius: '4px',
              whiteSpace: 'pre-wrap',
            }}
          >
            {snippetResult.imports[selectedLanguage].join('\n')}
          </pre>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <h3>Code:</h3>
        <pre
          style={{
            background: '#f5f5f5',
            padding: '15px',
            borderRadius: '4px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {snippetResult.content[selectedLanguage]}
        </pre>
      </div>
    </div>
  );
}

export default App; 