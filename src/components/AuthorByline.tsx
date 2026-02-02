import Image from 'next/image';
import { format } from 'date-fns';
import type { Article } from '@/types';

/** Default avatar: neutral person silhouette (SVG) when no author_avatar_url */
function DefaultAvatar({ name }: { name?: string | null }) {
  const initial = name?.trim().charAt(0)?.toUpperCase() ?? '?';
  return (
    <div
      className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-globalist-gray-200 bg-globalist-gray-100 text-globalist-gray-500"
      aria-hidden
    >
      <span className="text-lg font-semibold">{initial}</span>
    </div>
  );
}

export function AuthorByline({ article }: { article: Article }) {
  const hasAuthor =
    article.author_name || article.author_email || article.author_position || article.author_avatar_url;

  if (!hasAuthor) {
    return (
      <p className="mt-4 text-sm text-globalist-gray-500">
        {format(new Date(article.created_at), 'MMMM d, yyyy')}
      </p>
    );
  }

  return (
    <div className="mt-6 rounded-lg border border-globalist-gray-200 bg-globalist-gray-50/80 px-5 py-4">
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-globalist-gray-500">
        By author
      </p>
      <div className="flex flex-wrap items-center gap-4">
        {article.author_avatar_url ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-globalist-gray-200 bg-white">
            <Image
              src={article.author_avatar_url}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
        ) : (
          <DefaultAvatar name={article.author_name} />
        )}
        <div className="min-w-0 flex-1">
          {article.author_name && (
            <p className="font-semibold text-globalist-black">{article.author_name}</p>
          )}
          {article.author_position && (
            <p className="mt-0.5 text-sm text-globalist-gray-600">{article.author_position}</p>
          )}
          {article.author_email && (
            <a
              href={`mailto:${article.author_email}`}
              className="mt-1 inline-block text-sm text-globalist-gray-600 underline decoration-globalist-gray-400 hover:text-globalist-black hover:decoration-globalist-black"
            >
              {article.author_email}
            </a>
          )}
          <p className="mt-2 text-xs text-globalist-gray-500">
            {format(new Date(article.created_at), 'MMMM d, yyyy')}
          </p>
        </div>
      </div>
    </div>
  );
}
