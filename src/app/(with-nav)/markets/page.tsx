import Link from 'next/link';
import {
  WORLD_INDICES,
  US_STOCKS,
  CRYPTO,
  COMMODITIES,
  FOREX,
  BONDS,
} from '@/lib/markets-data';
import { MarketTable } from '@/components/markets/MarketTable';
import { AdSlot } from '@/components/AdSlot';

export const metadata = {
  title: 'Markets | Spectr',
  description: 'Stock indices, equities, crypto, forex, commodities, and bonds. Real-time market data.',
};

export default function MarketsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-8">
        <Link href="/" className="text-sm font-medium text-globalist-gray-600 hover:text-globalist-black">← Home</Link>
        <h1 className="mt-2 text-3xl font-bold text-globalist-black">Markets</h1>
        <p className="mt-1 text-globalist-gray-600">
          Indices, stocks, crypto, commodities, forex, and bonds. Data is delayed; for live data connect a market API.
        </p>
      </header>
      <div className="space-y-8">
        <MarketTable title="World Indices" rows={WORLD_INDICES} />
        <MarketTable title="US Stocks" rows={US_STOCKS} />
        <aside className="mx-auto max-w-4xl">
          <AdSlot slotId="markets-mid" format="leaderboard" className="w-full" />
        </aside>
        <div className="grid gap-8 lg:grid-cols-2">
          <MarketTable title="Crypto" rows={CRYPTO} />
          <MarketTable title="Commodities" rows={COMMODITIES} />
        </div>
        <div className="grid gap-8 lg:grid-cols-2">
          <MarketTable title="Forex" rows={FOREX} />
          <MarketTable title="Bonds & Rates" rows={BONDS} />
        </div>
      </div>
    </div>
  );
}
