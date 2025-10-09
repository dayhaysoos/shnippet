import { useEffect, useState } from 'react';
import './App.css';
import { snippetManager } from 'shnippet';
import type { SnippetName } from '../snippets/gen-types';
import type { SnippetResult } from 'shnippet';
import { SnippetCard } from './components/SnippetCard';

type LoadedSnippet = {
  data: SnippetResult;
  description: string;
};

const snippetMetadata: Record<SnippetName, string> = {
  add: 'Adds two numbers together.',
  subtract: 'Subtracts the second number from the first.',
};

function App() {
  const [snippets, setSnippets] = useState<LoadedSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSnippets() {
      try {
        const snippetNames = Object.keys(snippetMetadata) as SnippetName[];
        const results = await Promise.all(
          snippetNames.map(async (name) => {
            const result = await snippetManager.getSnippet(name);
            return {
              data: result,
              description: snippetMetadata[name],
            } satisfies LoadedSnippet;
          })
        );

        setSnippets(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load snippets');
      } finally {
        setIsLoading(false);
      }
    }

    loadSnippets();
  }, []);

  return (
    <main className="app">
      <header className="app__header">
        <h1>Shnippet Demo</h1>
        <p>Snippets generated from tests using the Shnippet CLI.</p>
      </header>

      {isLoading ? (
        <p className="status">Loading snippets…</p>
      ) : error ? (
        <p className="status status--error">{error}</p>
      ) : (
        <section className="app__snippets">
          {snippets.map(({ data, description }) => (
            <SnippetCard key={data.name} snippet={data} description={description} />
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
