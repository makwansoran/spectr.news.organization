'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/Header';
import { MarketTicker } from '@/components/MarketTicker';
import { AdSlot } from '@/components/AdSlot';
import { Footer } from '@/components/Footer';

const NO_NAVBAR_PATHS = ['/login'];

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = NO_NAVBAR_PATHS.some((path) => pathname === path || pathname?.startsWith(path + '/'));

  if (hideNavbar) {
    return <>{children}</>;
  }

  return (
    <>
      <MarketTicker />
      <Header />
      <aside className="border-b border-globalist-gray-200 bg-globalist-gray-100">
        <AdSlot slotId="header-leaderboard" format="leaderboard" />
      </aside>
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
