export type MarketRow = {
  symbol: string;
  name: string;
  last: string;
  change: string;
  changePercent: string;
  up: boolean;
};

export const WORLD_INDICES: MarketRow[] = [
  { symbol: '^GSPC', name: 'S&P 500', last: '5,234.18', change: '+21.84', changePercent: '+0.42%', up: true },
  { symbol: '^IXIC', name: 'Nasdaq Composite', last: '16,432.10', change: '+62.18', changePercent: '+0.38%', up: true },
  { symbol: '^DJI', name: 'Dow Jones', last: '38,654.22', change: '-46.32', changePercent: '-0.12%', up: false },
  { symbol: '^RUT', name: 'Russell 2000', last: '2,012.45', change: '+8.92', changePercent: '+0.44%', up: true },
  { symbol: '^FTSE', name: 'FTSE 100', last: '7,682.45', change: '+16.12', changePercent: '+0.21%', up: true },
  { symbol: '^GDAXI', name: 'DAX', last: '16,891.33', change: '+93.28', changePercent: '+0.55%', up: true },
  { symbol: '^FCHI', name: 'CAC 40', last: '7,456.22', change: '+22.18', changePercent: '+0.30%', up: true },
  { symbol: '^N225', name: 'Nikkei 225', last: '33,245.67', change: '-125.40', changePercent: '-0.38%', up: false },
  { symbol: '^HSI', name: 'Hang Seng', last: '16,892.11', change: '+88.32', changePercent: '+0.53%', up: true },
  { symbol: '^AXJO', name: 'S&P/ASX 200', last: '7,456.89', change: '+18.92', changePercent: '+0.25%', up: true },
];

export const US_STOCKS: MarketRow[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', last: '178.42', change: '+2.18', changePercent: '+1.24%', up: true },
  { symbol: 'MSFT', name: 'Microsoft Corp.', last: '378.91', change: '+4.22', changePercent: '+1.13%', up: true },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', last: '141.82', change: '-0.88', changePercent: '-0.62%', up: false },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', last: '178.56', change: '+3.12', changePercent: '+1.78%', up: true },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', last: '495.22', change: '+12.45', changePercent: '+2.58%', up: true },
  { symbol: 'META', name: 'Meta Platforms', last: '485.33', change: '+6.92', changePercent: '+1.45%', up: true },
  { symbol: 'TSLA', name: 'Tesla Inc.', last: '248.56', change: '-5.22', changePercent: '-2.06%', up: false },
  { symbol: 'BRK-B', name: 'Berkshire Hathaway', last: '362.18', change: '+1.88', changePercent: '+0.52%', up: true },
  { symbol: 'JPM', name: 'JPMorgan Chase', last: '195.44', change: '+2.12', changePercent: '+1.10%', up: true },
  { symbol: 'V', name: 'Visa Inc.', last: '278.92', change: '-1.22', changePercent: '-0.44%', up: false },
  { symbol: 'JNJ', name: 'Johnson & Johnson', last: '158.33', change: '+0.92', changePercent: '+0.58%', up: true },
  { symbol: 'WMT', name: 'Walmart Inc.', last: '165.78', change: '+2.45', changePercent: '+1.50%', up: true },
];

export const CRYPTO: MarketRow[] = [
  { symbol: 'BTC-USD', name: 'Bitcoin', last: '$43,210', change: '+512', changePercent: '+1.20%', up: true },
  { symbol: 'ETH-USD', name: 'Ethereum', last: '$2,345', change: '-7.02', changePercent: '-0.30%', up: false },
  { symbol: 'BNB-USD', name: 'BNB', last: '$312.45', change: '+4.22', changePercent: '+1.37%', up: true },
  { symbol: 'SOL-USD', name: 'Solana', last: '$98.56', change: '+3.12', changePercent: '+3.27%', up: true },
  { symbol: 'XRP-USD', name: 'XRP', last: '$0.5234', change: '+0.012', changePercent: '+2.35%', up: true },
  { symbol: 'ADA-USD', name: 'Cardano', last: '$0.4521', change: '-0.008', changePercent: '-1.74%', up: false },
  { symbol: 'DOGE-USD', name: 'Dogecoin', last: '$0.0823', change: '+0.002', changePercent: '+2.49%', up: true },
  { symbol: 'AVAX-USD', name: 'Avalanche', last: '$38.92', change: '+1.22', changePercent: '+3.23%', up: true },
];

export const COMMODITIES: MarketRow[] = [
  { symbol: 'CL=F', name: 'Crude Oil WTI', last: '$72.45', change: '+0.58', changePercent: '+0.80%', up: true },
  { symbol: 'BZ=F', name: 'Brent Crude', last: '$77.82', change: '+0.42', changePercent: '+0.54%', up: true },
  { symbol: 'GC=F', name: 'Gold', last: '$2,034.50', change: '-8.20', changePercent: '-0.40%', up: false },
  { symbol: 'SI=F', name: 'Silver', last: '$24.18', change: '+0.32', changePercent: '+1.34%', up: true },
  { symbol: 'HG=F', name: 'Copper', last: '$3.82', change: '+0.05', changePercent: '+1.33%', up: true },
  { symbol: 'NG=F', name: 'Natural Gas', last: '$2.45', change: '-0.08', changePercent: '-3.16%', up: false },
  { symbol: 'ZW=F', name: 'Wheat', last: '$5.82', change: '+0.12', changePercent: '+2.11%', up: true },
  { symbol: 'ZC=F', name: 'Corn', last: '$4.52', change: '-0.05', changePercent: '-1.09%', up: false },
];

export const FOREX: MarketRow[] = [
  { symbol: 'EURUSD', name: 'Euro / US Dollar', last: '1.0842', change: '+0.0012', changePercent: '+0.11%', up: true },
  { symbol: 'GBPUSD', name: 'British Pound / USD', last: '1.2684', change: '+0.0018', changePercent: '+0.14%', up: true },
  { symbol: 'USDJPY', name: 'US Dollar / Yen', last: '149.82', change: '-0.42', changePercent: '-0.28%', up: false },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', last: '0.8822', change: '+0.0008', changePercent: '+0.09%', up: true },
  { symbol: 'AUDUSD', name: 'Australian Dollar / USD', last: '0.6522', change: '-0.0012', changePercent: '-0.18%', up: false },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', last: '1.3522', change: '+0.0015', changePercent: '+0.11%', up: true },
];

export const BONDS: MarketRow[] = [
  { symbol: '^TNX', name: '10-Year Treasury', last: '4.12%', change: '+0.02', changePercent: '+2bp', up: false },
  { symbol: '^IRX', name: '13-Week Treasury', last: '5.28%', change: '+0.01', changePercent: '+1bp', up: false },
  { symbol: '^TYX', name: '30-Year Treasury', last: '4.28%', change: '-0.01', changePercent: '-1bp', up: true },
  { symbol: '^FVX', name: '5-Year Treasury', last: '4.02%', change: '+0.02', changePercent: '+2bp', up: false },
];
