import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureIcons: React.ComponentType<React.ComponentProps<'svg'>>[] = [
  require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  require('@site/static/img/undraw_docusaurus_tree.svg').default,
  require('@site/static/img/undraw_docusaurus_react.svg').default,
];

const FeatureList: FeatureItem[] = [
  {
    title: 'Test-Driven Documentation',
    description: (
      <>
        Extract code snippets directly from your tests. Your documentation stays in sync with your
        code, ensuring examples are always accurate and working.
      </>
    ),
  },
  {
    title: 'Type Safety',
    description: (
      <>
        Automatically generated TypeScript types for your snippet names. Get autocomplete and type
        checking to prevent typos and errors.
      </>
    ),
  },
  {
    title: 'Multi-Language Support',
    description: (
      <>
        Support for multiple programming languages with language-specific formatting. Show the same
        snippet in different languages with proper syntax highlighting.
      </>
    ),
  },
];

type FeatureProps = FeatureItem & {
  Icon: React.ComponentType<React.ComponentProps<'svg'>>;
};

function Feature({ title, description, Icon }: FeatureProps) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center"></div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} Icon={FeatureIcons[idx % FeatureIcons.length]} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
