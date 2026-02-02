'use client';

import { usePathname } from 'next/navigation';
import { AdSlot } from '@/components/AdSlot';

export function TopAdSlot() {
  const pathname = usePathname();
  if (pathname === '/subscribe') return null;
  return (
    <aside>
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <AdSlot slotId="header-leaderboard" format="leaderboard" />
      </div>
    </aside>
  );
}
