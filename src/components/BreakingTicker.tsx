'use client';

import Link from 'next/link';
import type { Article } from '@/types';

export function BreakingTicker({ items }: { items: Article[] }) {
  if (items.length === 0) return null;

  const duplicated = [...items, ...items];

  return (
    <div className="border-b border-globalist-gray-200 bg-globalist-gray-100 py-2">
      <div className="flex animate-ticker whitespace-nowrap text-sm">
        {duplicated.map((article, i) => (
          <Link
            key={`${article.id}-${i}`}
            href={`/news/${article.slug}`}
            className="mx-6 font-medium text-globalist-black hover:text-bloomberg-blue"
          >
            <span className="text-bloomberg-blue font-semibold">BREAKING</span>
            {' · '}
            {article.title}
          </Link>
        ))}
      </div>
    </div>
  );
}
