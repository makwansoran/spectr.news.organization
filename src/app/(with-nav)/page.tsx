import { getArticles } from '@/lib/articles';
import { HeroFeatured } from '@/components/home/HeroFeatured';
import { BreakingList } from '@/components/home/BreakingList';
import { TrendingRow } from '@/components/home/TrendingRow';
import { BreakingLarge } from '@/components/home/BreakingLarge';
import { PopularGrid } from '@/components/home/PopularGrid';
import { EditorChoice } from '@/components/home/EditorChoice';
import { WorthReading } from '@/components/home/WorthReading';
import { LatestSection } from '@/components/home/LatestSection';
import { AdSlot } from '@/components/AdSlot';
import type { Article } from '@/types';

export default async function HomePage() {
  let featured: Article | undefined;
  let breakingList: Article[] = [];
  let trending: Article[] = [];
  let breakingLarge: Article | undefined;
  let popular: Article[] = [];
  let editorChoice: Article[] = [];
  let worthReading: Article[] = [];
  let latest: Article[] = [];

  try {
    const [featuredRes, breakingRes, trendingRes, popularRes, editorChoiceRes, worthReadingRes, latestRes] = await Promise.all([
      getArticles({ homepageSection: 'featured', limit: 1 }),
      getArticles({ homepageSection: 'breaking', limit: 10 }),
      getArticles({ homepageSection: 'trending', limit: 4 }),
      getArticles({ homepageSection: 'popular', limit: 4 }),
      getArticles({ homepageSection: 'editor_choice', limit: 3 }),
      getArticles({ homepageSection: 'worth_reading', limit: 5 }),
      getArticles({ limit: 12 }),
    ]);
    featured = featuredRes[0];
    breakingList = breakingRes;
    breakingLarge = breakingRes[0];
    trending = trendingRes;
    popular = popularRes;
    editorChoice = editorChoiceRes;
    worthReading = worthReadingRes;
    latest = latestRes;
  } catch {
    // show empty when API fails
  }

  return (
    <div className="min-h-screen bg-globalist-white text-globalist-black">
      {/* Hero: large featured left + Breaking News list right */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-6">
        <div className="lg:col-span-8">
          {featured && <HeroFeatured article={featured} />}
        </div>
        <aside className="mt-4 lg:col-span-4 lg:mt-0">
          <BreakingList articles={breakingList} />
        </aside>
      </section>

      {/* Trending Now */}
      {trending.length > 0 && <TrendingRow articles={trending} />}

      {/* Mid-page: Breaking News (large) left + Popular Now (2x2) right */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6">
          {breakingLarge && <BreakingLarge article={breakingLarge} />}
        </div>
        <div className="mt-8 lg:col-span-6 lg:mt-0">
          <PopularGrid articles={popular} />
        </div>
      </section>

      {/* Ad leaderboard */}
      <aside className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <AdSlot slotId="homepage-mid" format="leaderboard" />
      </aside>

      {/* Bottom: Editor Choice (3 cards) left + Worth Reading (list) right */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <EditorChoice articles={editorChoice} />
        </div>
        <aside className="mt-8 lg:col-span-5 lg:mt-0">
          <WorthReading articles={worthReading} />
        </aside>
      </section>

      {/* Latest: all recent articles (so your posts always show) */}
      <LatestSection articles={latest} />
    </div>
  );
}
