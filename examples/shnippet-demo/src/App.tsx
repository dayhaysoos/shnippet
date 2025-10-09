import { useEffect, useState } from 'react';
import './App.css';
import { snippetManager } from 'shnippet';
import type { SnippetName } from '../public/snippets/gen-types';
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

      <div className="app__content">
        <section className="app__snippets">
          {isLoading ? (
            <p className="status">Loading snippets…</p>
          ) : error ? (
            <p className="status status--error">{error}</p>
          ) : (
            snippets.map(({ data, description }) => (
              <SnippetCard key={data.name} snippet={data} description={description} />
            ))
          )}
        </section>

        <aside className="app__sidebar" aria-label="Project details">
          <div className="info-card">
            <h2>How this example works</h2>
            <p>
              The tests in both TypeScript and Python are annotated with Shnippet tags. Running the
              CLI extracts the tagged regions and keeps the language tabs in sync with the generated
              snippet files.
            </p>

            <div className="info-card__section">
              <h3>Try it locally</h3>
              <ul>
                <li>
                  <code>pnpm --filter shnippet-demo test:run</code> — run the Vitest suite
                </li>
                <li>
                  <code>pnpm --filter shnippet-demo test:python</code> — run the Python tests
                </li>
                <li>
                  <code>pnpm --filter shnippet-demo shnippet</code> — regenerate snippets
                </li>
              </ul>
            </div>

            <div className="info-card__section">
              <h3>Source reference</h3>
              <p>
                Browse the tests and configuration in the repository once it is published to GitHub.
              </p>
              <a
                className="info-card__link"
                href="https://github.com/shnippet/shnippet-demo"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default App;
