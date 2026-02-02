import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { Article } from '@/types';
import clsx from 'clsx';

export function ArticleCard({
  article,
  size = 'default',
  showCategory = true,
}: {
  article: Article;
  size?: 'default' | 'large' | 'compact';
  showCategory?: boolean;
}) {
  const href = `/news/${article.slug}`;
  const isLarge = size === 'large';
  const isCompact = size === 'compact';

  return (
    <Link
      href={href}
      className={clsx(
        'bento-card block overflow-hidden',
        isLarge && 'md:col-span-2 md:row-span-2',
        isCompact && 'flex gap-3'
      )}
    >
      {article.featured_image_url && !isCompact && (
        <div
          className={clsx(
            'relative bg-globalist-gray-200',
            isLarge ? 'h-64 md:h-full min-h-[280px]' : 'h-40'
          )}
        >
          <Image
            src={article.featured_image_url}
            alt=""
            fill
            className="object-cover"
            sizes={isLarge ? '(min-width: 768px) 50vw, 100vw' : '33vw'}
          />
          {article.is_breaking && (
            <span className="absolute left-2 top-2 bg-bloomberg-blue px-2 py-0.5 text-xs font-semibold text-white">
              Breaking
            </span>
          )}
        </div>
      )}
      <div className={clsx('p-4', isCompact && 'flex-1 min-w-0')}>
        {showCategory && (
          <span className="text-xs font-semibold uppercase tracking-wide text-bloomberg-blue">
            {article.category}
          </span>
        )}
        <h2
          className={clsx(
            'font-semibold text-globalist-black line-clamp-2',
            isLarge && 'text-xl md:text-2xl',
            isCompact && 'text-sm line-clamp-1'
          )}
        >
          {article.title}
        </h2>
        {article.subheadline && (
          <p className={clsx('text-globalist-gray-600 line-clamp-2', isCompact ? 'mt-0.5 text-xs line-clamp-1' : 'mt-1 text-sm')}>
            {article.subheadline}
          </p>
        )}
        {!isCompact && !article.subheadline && article.excerpt && (
          <p className="mt-1 text-sm text-globalist-gray-600 line-clamp-2">
            {article.excerpt}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          {article.author_avatar_url && (
            <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-globalist-gray-200 bg-globalist-gray-100">
              <Image src={article.author_avatar_url} alt="" fill className="object-cover" sizes="24px" />
            </div>
          )}
          <p className="text-xs text-globalist-gray-500">
            {format(new Date(article.created_at), 'MMM d, yyyy')}
            {article.author_name && ` · ${article.author_name}`}
          </p>
        </div>
      </div>
    </Link>
  );
}
