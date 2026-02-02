'use client';

/**
 * AdSlot – Google AdSense placeholder components.
 * Once approved by AdSense (15–20 quality articles), paste your Client ID
 * and slot IDs in .env.local and use the AdSense script here.
 *
 * Locations: Top Header Leaderboard, Sidebar, Mid-Article
 */
export function AdSlot({
  slotId,
  format = 'rectangle',
  className = '',
}: {
  slotId: string;
  format?: 'leaderboard' | 'sidebar' | 'sidebar-tall' | 'mid-article' | 'rectangle';
  className?: string;
}) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const dimensions: Record<string, string> = {
    leaderboard: '728x90',
    sidebar: '300x250',
    'sidebar-tall': '300x600',
    'mid-article': '336x280',
    rectangle: '300x250',
  };
  const dim = dimensions[format] ?? dimensions.rectangle;
  const [w, h] = dim.split('x').map(Number);

  return (
    <div
      className={`flex items-center justify-center bg-globalist-gray-100 border border-globalist-gray-200 text-globalist-gray-500 text-sm ${className}`}
      style={{ minWidth: w, minHeight: h }}
      data-ad-slot={slotId}
      data-ad-format={format}
    >
      {clientId ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minWidth: w, minHeight: h }}
          data-ad-client={clientId}
          data-ad-slot={slotId}
          data-ad-format="auto"
        />
      ) : (
        <span>
          Ad Slot · {format} · {dim}
        </span>
      )}
    </div>
  );
}
