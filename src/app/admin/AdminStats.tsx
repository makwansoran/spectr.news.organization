'use client';

import { useState, useEffect } from 'react';

type Stats = {
  totalVisitors: number;
  totalArticles: number;
  articlesOnHomepage: number;
};

export function AdminStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analytics/stats', { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load');
        return r.json();
      })
      .then(setStats)
      .catch(() => setError('Could not load statistics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-globalist-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-globalist-gray-500">Page views</p>
          <p className="mt-1 text-2xl font-bold text-globalist-black">—</p>
        </div>
        <div className="rounded-lg border border-globalist-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-globalist-gray-500">Total articles</p>
          <p className="mt-1 text-2xl font-bold text-globalist-black">—</p>
        </div>
        <div className="rounded-lg border border-globalist-gray-200 bg-white p-4 shadow-sm">
          <p className="text-sm text-globalist-gray-500">On homepage</p>
          <p className="mt-1 text-2xl font-bold text-globalist-black">—</p>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="mb-8 rounded-lg border border-globalist-gray-200 bg-globalist-gray-50 p-4 text-sm text-globalist-gray-600">
        {error ?? 'No statistics available. Run the page_views migration in Supabase to enable visitor counts.'}
      </div>
    );
  }

  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-3">
      <div className="rounded-lg border border-globalist-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-globalist-gray-500">Page views</p>
        <p className="mt-1 text-2xl font-bold text-globalist-black">
          {stats.totalVisitors.toLocaleString()}
        </p>
        <p className="mt-0.5 text-xs text-globalist-gray-500">Total site visits</p>
      </div>
      <div className="rounded-lg border border-globalist-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-globalist-gray-500">Total articles</p>
        <p className="mt-1 text-2xl font-bold text-globalist-black">
          {stats.totalArticles.toLocaleString()}
        </p>
        <p className="mt-0.5 text-xs text-globalist-gray-500">Published</p>
      </div>
      <div className="rounded-lg border border-globalist-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-globalist-gray-500">On homepage</p>
        <p className="mt-1 text-2xl font-bold text-globalist-black">
          {stats.articlesOnHomepage.toLocaleString()}
        </p>
        <p className="mt-0.5 text-xs text-globalist-gray-500">Featured on front page</p>
      </div>
    </div>
  );
}
