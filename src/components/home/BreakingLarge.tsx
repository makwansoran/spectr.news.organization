import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Article } from '@/types';

export function BreakingLarge({ article }: { article: Article }) {
  return (
    <div className="flex h-full flex-col">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-globalist-black">
        Breaking News
      </h3>
      <Link
        href={`/news/${article.slug}`}
        className="relative flex-1 overflow-hidden rounded-lg border border-globalist-gray-200 bg-globalist-white"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {article.featured_image_url ? (
            <Image
              src={article.featured_image_url}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="h-full w-full bg-globalist-gray-200" />
          )}
          <div className="absolute left-2 top-2 flex gap-2">
            <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
              Breaking
            </span>
            <span className="rounded bg-bloomberg-blue px-2 py-0.5 text-xs font-semibold text-white capitalize">
              {article.category}
            </span>
          </div>
        </div>
        <div className="p-4">
          <h4 className="text-lg font-bold text-globalist-black line-clamp-2 md:text-xl">
            {article.title}
          </h4>
          <p className="mt-1 text-xs text-globalist-gray-600">
            {format(new Date(article.created_at), 'MMM d, yyyy')}
          </p>
        </div>
      </Link>
    </div>
  );
}
