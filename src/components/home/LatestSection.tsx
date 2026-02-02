import { ArticleCard } from '@/components/ArticleCard';
import type { Article } from '@/types';

export function LatestSection({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h2 className="mb-6 text-lg font-bold uppercase tracking-wide text-globalist-black sm:text-xl">
        Latest
      </h2>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <li key={article.id}>
            <ArticleCard article={article} size="default" showCategory={true} />
          </li>
        ))}
      </ul>
    </section>
  );
}
