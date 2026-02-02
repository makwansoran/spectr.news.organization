import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

export function EditorChoice({ articles }: { articles: Article[] }) {
  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-globalist-black">
        Editor Choice
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <Link
            key={article.id}
            href={`/news/${article.slug}`}
            className="overflow-hidden rounded-lg border border-globalist-gray-200 bg-globalist-white"
          >
            <div className="relative aspect-video overflow-hidden">
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
              <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white capitalize">
                {article.category}
              </span>
            </div>
            <div className="p-3">
              <h4 className="line-clamp-2 text-sm font-semibold text-globalist-black">
                {article.title}
              </h4>
              {article.excerpt && (
                <p className="mt-1 line-clamp-2 text-xs text-globalist-gray-600">
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
