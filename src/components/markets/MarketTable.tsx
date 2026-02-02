import type { MarketRow } from '@/lib/markets-data';

export function MarketTable({
  title,
  rows,
}: {
  title: string;
  rows: MarketRow[];
}) {
  return (
    <section className="rounded-lg border border-globalist-gray-200 bg-globalist-white overflow-hidden">
      <h2 className="border-b border-globalist-gray-200 bg-globalist-gray-50 px-4 py-3 text-sm font-bold uppercase tracking-wide text-globalist-black">
        {title}
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-sm">
          <thead>
            <tr className="border-b border-globalist-gray-200 text-left text-xs font-medium uppercase tracking-wide text-globalist-gray-500">
              <th className="px-4 py-3">Symbol</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3 text-right">Last</th>
              <th className="px-4 py-3 text-right">Change</th>
              <th className="px-4 py-3 text-right">% Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-globalist-gray-100">
            {rows.map((row) => (
              <tr key={row.symbol} className="hover:bg-globalist-gray-50/50">
                <td className="px-4 py-2.5 font-medium text-globalist-black">{row.symbol}</td>
                <td className="px-4 py-2.5 text-globalist-gray-700">{row.name}</td>
                <td className="px-4 py-2.5 text-right font-medium text-globalist-black">{row.last}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${row.up ? 'text-green-600' : 'text-red-600'}`}>
                  {row.change}
                </td>
                <td className={`px-4 py-2.5 text-right font-medium ${row.up ? 'text-green-600' : 'text-red-600'}`}>
                  {row.changePercent}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
