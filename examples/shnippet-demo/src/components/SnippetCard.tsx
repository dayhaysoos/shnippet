import { useMemo, useState } from 'react';
import type { SnippetResult } from 'shnippet';

interface SnippetCardProps {
  snippet: SnippetResult;
  description: string;
}

export function SnippetCard({ snippet, description }: SnippetCardProps) {
  const languages = useMemo(
    () => (snippet.languages.length > 0 ? snippet.languages : [snippet.defaultLanguage]),
    [snippet.languages, snippet.defaultLanguage]
  );
  const [activeLanguage, setActiveLanguage] = useState(() => languages[0]);
  const code = snippet.content[activeLanguage] ?? '';

  return (
    <article className="snippet-card">
      <header className="snippet-card__header">
        <div>
          <h2>{snippet.name}</h2>
          <p className="snippet-card__description">{description}</p>
        </div>
        <nav className="snippet-card__tabs" aria-label="Available languages">
          {languages.map((lang) => (
            <button
              key={lang}
              type="button"
              className={`snippet-card__tab${lang === activeLanguage ? ' is-active' : ''}`}
              onClick={() => setActiveLanguage(lang)}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </nav>
      </header>

      <pre className="snippet-card__code">
        <code>{code.trim()}</code>
      </pre>
    </article>
  );
}
