import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Article } from '@/types';

export function WorthReading({ articles }: { articles: Article[] }) {
  return (
    <div className="flex flex-col">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-globalist-black">
        Worth Reading
      </h3>
      <ul className="space-y-4">
        {articles.slice(0, 5).map((article) => (
          <li key={article.id}>
            <Link
              href={`/news/${article.slug}`}
              className="flex gap-3"
            >
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded bg-globalist-gray-200">
                {article.featured_image_url ? (
                  <Image
                    src={article.featured_image_url}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="h-full w-full bg-globalist-gray-300" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="line-clamp-2 text-sm font-medium text-globalist-black">
                  {article.title}
                </h4>
                <p className="mt-0.5 text-xs text-globalist-gray-600">
                  {format(new Date(article.created_at), 'MMM d, yyyy')} / {article.category}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
