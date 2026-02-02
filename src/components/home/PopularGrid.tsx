import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

export function PopularGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-globalist-black">
        Popular Now
      </h3>
      <div className="grid flex-1 grid-cols-2 gap-3">
        {articles.slice(0, 4).map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="overflow-hidden rounded-lg border border-globalist-gray-200 bg-globalist-white"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {article.featured_image_url ? (
                <Image
                  src={article.featured_image_url}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-globalist-gray-200" />
              )}
              <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white capitalize">
                {article.category}
              </span>
            </div>
            <div className="p-2">
              <h4 className="line-clamp-2 text-xs font-semibold text-globalist-black">
                {article.title}
              </h4>
              {article.excerpt && (
                <p className="mt-0.5 line-clamp-1 text-xs text-globalist-gray-600">
                  {article.excerpt}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
