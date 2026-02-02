import { Header } from '@/components/Header';
import { TopAdSlot } from '@/components/TopAdSlot';
import { AdSlot } from '@/components/AdSlot';
import { Footer } from '@/components/Footer';
import { ViewTracker } from '@/components/ViewTracker';

export default function WithNavLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ViewTracker />
      <Header />
      <TopAdSlot />
      <main className="flex-1">{children}</main>
      <aside>
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <AdSlot slotId="footer-leaderboard" format="leaderboard" />
        </div>
      </aside>
      <Footer />
    </>
  );
}
