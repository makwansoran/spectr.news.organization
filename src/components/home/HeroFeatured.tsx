import Link from 'next/link';
import Image from 'next/image';
import type { Article } from '@/types';

export function HeroFeatured({ article }: { article: Article }) {
  return (
    <Link href={`/news/${article.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-lg border border-globalist-gray-200 bg-globalist-gray-200 md:aspect-[16/10]">
      {article.featured_image_url && (
        <Image
          src={article.featured_image_url}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 66vw"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-8">
        <span className="mb-2 inline-block rounded bg-red-600 px-2 py-0.5 text-xs font-bold uppercase text-white">
          Hot Now
        </span>
        <h2 className="text-xl font-bold text-white sm:text-2xl md:text-3xl lg:text-4xl">
          {article.title}
        </h2>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-globalist-gray-300 sm:text-base">
            {article.excerpt}
          </p>
        )}
      </div>
    </Link>
  );
}
