import React, { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import styles from './styles.module.css';
import CodeBlock from '@theme/CodeBlock';
import { snippetManager, SnippetResult } from 'shnippet'
import type { SnippetName } from '../../../snippets/gen-types';

export default function HomepageDemo(): ReactNode {
  const [snippet, setSnippet] = useState<SnippetResult | null>(null);

  useEffect(() => {
    snippetManager.getSnippet('add' as SnippetName).then(setSnippet);
  }, []);

  if (!snippet) return null;

  return (
    <section className={styles.demo}>
      <div className="container">
        <h2 className={styles.title}>How It Works</h2>
        <div className={styles.flow}>
          {/* Step 1: Create Snippet */}
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>1. Create Snippet</h2>
            <div className={styles.codeBlock}>
              <CodeBlock language="typescript">
                {`// math.test.ts
describe('Math functions', () => {
  it('should add numbers', () => {
    // :snippet-start: add
    const result = add(2, 3);
    // result is 5
    // :snippet-end:
    expect(result).toBe(5);
  });
});`}
              </CodeBlock>
            </div>
          </div>

          {/* Step 2: Generated Output (ts) */}
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>2. Generated Output (ts)</h2>
            <div className={styles.codeBlock}>
              <CodeBlock language="typescript">
                {snippet?.content.ts}
              </CodeBlock>
            </div>
          </div>

          {/* Step 3: Use Snippet */}
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>3. Use Snippet</h2>
            <div className={styles.codeBlock}>
              <CodeBlock language="tsx">
                {`import { snippetManager } from 'shnippet';
import type { SnippetName } from '../snippets/gen-types';

// Fetch the snippet result
const result = await snippetManager.getSnippet('add' as SnippetName);

// Pass it into your component (defined below in Step 4)
<SnippetInReact result={result} />`}
              </CodeBlock>
            </div>
          </div>

          {/* Step 4: Render in React */}
          <div className={styles.step}>
            <h2 className={styles.stepTitle}>4. Render in React</h2>
            <div className={styles.codeBlock}>
              <CodeBlock language="tsx">
                {`import type { SnippetResult } from 'shnippet';
import CodeBlock from '@theme/CodeBlock';

export function SnippetInReact({ result }: { result: SnippetResult }) {
  return (
    <CodeBlock language="typescript">
      {result.content.ts}
    </CodeBlock>
  );
}`}
              </CodeBlock>
            </div>
          </div>
        </div>
        <div className={styles.cta}>
          <a href="/docs/quick-start" className="button button--primary">
            Get Started →
          </a>
        </div>
      </div>
    </section>
  );
} 