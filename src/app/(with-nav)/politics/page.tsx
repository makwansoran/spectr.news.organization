import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import { ArticleCard } from '@/components/ArticleCard';
import { AdSlot } from '@/components/AdSlot';

export const metadata = {
  title: 'Politics | spectr',
  description: 'Politics news and analysis from spectr.',
};

export default async function PoliticsPage() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    articles = await getArticles({ category: 'politics', limit: 24 });
  } catch {
    // show empty when API fails
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-8">
        <Link href="/" className="text-sm font-medium text-bloomberg-blue hover:underline">← Home</Link>
        <h1 className="mt-2 text-3xl font-bold text-globalist-black">Politics</h1>
        <p className="mt-1 text-globalist-gray-600">Policy, elections, and governance from around the world.</p>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24">
            <AdSlot slotId="politics-sidebar" format="sidebar" className="w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}
