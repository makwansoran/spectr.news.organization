import Link from 'next/link';
import { getArticles } from '@/lib/articles';
import { ArticleCard } from '@/components/ArticleCard';
import { AdSlot } from '@/components/AdSlot';

export const metadata = {
  title: 'Trade | spectr',
  description: 'Trade and markets news from spectr.',
};

export default async function TradePage() {
  let articles: Awaited<ReturnType<typeof getArticles>> = [];
  try {
    articles = await getArticles({ category: 'trade', limit: 24 });
  } catch {
    // show empty when API fails
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-8">
        <Link href="/" className="text-sm font-medium text-bloomberg-blue hover:underline">← Home</Link>
        <h1 className="mt-2 text-3xl font-bold text-globalist-black">Trade</h1>
        <p className="mt-1 text-globalist-gray-600">Trade, tariffs, and global commerce from around the world.</p>
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
            <AdSlot slotId="trade-sidebar" format="sidebar" className="w-full" />
          </div>
        </aside>
      </div>
    </div>
  );
}
