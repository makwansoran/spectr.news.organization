'use client';

const TICKER_ITEMS = [
  { symbol: 'SPX', name: 'S&P 500', value: '5,234.18', change: '+0.42%', up: true },
  { symbol: 'NDX', name: 'Nasdaq', value: '16,432.10', change: '+0.38%', up: true },
  { symbol: 'DJI', name: 'Dow', value: '38,654.22', change: '-0.12%', up: false },
  { symbol: 'FTSE', name: 'FTSE 100', value: '7,682.45', change: '+0.21%', up: true },
  { symbol: 'DAX', name: 'DAX', value: '16,891.33', change: '+0.55%', up: true },
  { symbol: 'BTC', name: 'Bitcoin', value: '$43,210', change: '+1.2%', up: true },
  { symbol: 'ETH', name: 'Ethereum', value: '$2,345', change: '-0.3%', up: false },
  { symbol: 'US10Y', name: '10Y Treasury', value: '4.12%', change: '+2bp', up: false },
  { symbol: 'WTI', name: 'Oil WTI', value: '$72.45', change: '+0.8%', up: true },
  { symbol: 'GBP', name: 'GBP/USD', value: '1.2684', change: '+0.1%', up: true },
];

export function MarketTicker() {
  const duplicated = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="bg-globalist-black text-globalist-white overflow-hidden border-b border-globalist-gray-700">
      <div className="flex animate-ticker whitespace-nowrap py-1.5 text-xs font-medium tracking-wide">
        {duplicated.map((item, i) => (
          <span key={`${item.symbol}-${i}`} className="mx-6 flex items-center gap-2">
            <span className="text-globalist-gray-400">{item.symbol}</span>
            <span>{item.value}</span>
            <span className={item.up ? 'text-green-400' : 'text-red-400'}>
              {item.change}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
