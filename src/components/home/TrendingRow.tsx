import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

export function TrendingRow({ articles }: { articles: Article[] }) {
  return (
    <section className="border-t border-globalist-gray-200 bg-globalist-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-globalist-black">
          <svg className="h-5 w-5 text-bloomberg-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Trending Now
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="overflow-hidden rounded-lg border border-globalist-gray-200 bg-globalist-white"
            >
              <div className="relative aspect-square overflow-hidden">
                {article.featured_image_url ? (
                  <Image
                    src={article.featured_image_url}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, 33vw"
                  />
                ) : (
                  <div className="h-full w-full bg-globalist-gray-200" />
                )}
              </div>
              <h4 className="p-3 text-sm font-semibold text-globalist-black line-clamp-2">
                {article.title}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
