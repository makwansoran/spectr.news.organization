import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { getArticleBySlug, getRelatedArticles } from '@/lib/articles';
import { AdSlot } from '@/components/AdSlot';
import { ArticleCard } from '@/components/ArticleCard';
import { AuthorByline } from '@/components/AuthorByline';
import { ShareButtons } from '@/components/ShareButtons';
import type { Category } from '@/types';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: 'Article Not Found | Spectr' };
  return {
    title: `${article.title} | Spectr`,
    description: article.subheadline ?? article.excerpt ?? article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: article.featured_image_url ? [article.featured_image_url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  let related: Awaited<ReturnType<typeof getRelatedArticles>> = [];
  try {
    related = await getRelatedArticles(article.category as Category, slug, 4);
  } catch {
    // show empty related
  }

  const headersList = await headers();
  const host = headersList.get('host') || process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const canonicalUrl = `${protocol}://${host}/news/${article.slug}`;

  return (
    <article className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <header className="mb-4">
            <span className="text-xs font-semibold uppercase tracking-wide text-bloomberg-blue">{article.category}</span>
            {article.is_breaking && <span className="ml-2 rounded bg-bloomberg-blue px-2 py-0.5 text-xs font-semibold text-white">Breaking</span>}
            <h1 className="mt-2 text-3xl font-bold text-globalist-black md:text-4xl">{article.title}</h1>
          </header>
          {article.featured_image_url && (
            <div className="relative mb-6 aspect-video w-full overflow-hidden bg-globalist-gray-200">
              <Image src={article.featured_image_url} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 66vw" priority />
            </div>
          )}
          {article.subheadline && (
            <p className="mb-6 text-sm text-globalist-gray-600 md:text-base">{article.subheadline}</p>
          )}
          <AuthorByline article={article} />
          <div className="mt-6 prose-globalist prose max-w-none" dangerouslySetInnerHTML={{ __html: article.body }} />
          <div className="my-8 flex justify-center">
            <AdSlot slotId="mid-article" format="mid-article" />
          </div>
          <ShareButtons title={article.title} url={canonicalUrl} />
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <AdSlot slotId="sidebar" format="sidebar" className="w-full" />
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-bloomberg-blue">Related Stories</h3>
              <ul className="space-y-4">
                {related.map((r) => (
                  <li key={r.id}>
                    <ArticleCard article={r} size="compact" showCategory={true} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </article>
  );
}
