'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  created_at: string;
  show_on_homepage?: boolean;
  homepage_section?: string | null;
};

const HOMEPAGE_SECTIONS = [
  { value: '', label: '—' },
  { value: 'featured', label: 'Featured' },
  { value: 'breaking', label: 'Breaking' },
  { value: 'trending', label: 'Trending' },
  { value: 'popular', label: 'Popular' },
  { value: 'editor_choice', label: "Editor's Choice" },
  { value: 'worth_reading', label: 'Worth Reading' },
] as const;

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('');

  useEffect(() => {
    const url = categoryFilter
      ? `/api/articles?limit=100&category=${encodeURIComponent(categoryFilter)}`
      : '/api/articles?limit=100';
    fetch(url)
      .then((r) => r.json())
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [categoryFilter]);

  const isLegacy = (createdAt: string) => {
    return new Date(createdAt).getTime() < Date.now() - 24 * 60 * 60 * 1000;
  };

  const setArticleSection = async (id: string, section: string) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homepage_section: section || null }),
      });
      if (res.ok) {
        const newSection = section || null;
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, homepage_section: newSection, show_on_homepage: !!newSection } : a))
        );
      }
    } finally {
      setTogglingId(null);
    }
  };

  const toggleHomepage = async (id: string, currentShow: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ show_on_homepage: !currentShow }),
      });
      if (res.ok) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, show_on_homepage: !currentShow, homepage_section: !currentShow ? null : a.homepage_section } : a))
        );
      }
    } finally {
      setTogglingId(null);
    }
  };

  const bySection = HOMEPAGE_SECTIONS.filter((x) => x.value).map(({ value, label }) => ({
    value,
    label,
    articles: articles.filter((a) => (a.homepage_section || '') === value),
  }));

  const categories = ['', 'politics', 'economy', 'finance', 'trade', 'companies', 'breaking'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-globalist-black">All articles</h1>
      <p className="mt-1 text-sm text-globalist-gray-600">
        View and manage articles. Assign each article to one homepage section so it appears in only one place.
      </p>

      {!loading && articles.some((a) => a.homepage_section) && (
        <div className="mt-8 rounded-lg border border-globalist-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-globalist-black">Where news appear</h2>
          <p className="mb-4 text-sm text-globalist-gray-600">
            Which articles are in each homepage section. Each article appears in only one section.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bySection.map(
              ({ value, label, articles: list }) =>
                list.length > 0 && (
                  <div key={value} className="rounded border border-globalist-gray-100 bg-globalist-gray-50/50 p-3">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-globalist-gray-600">
                      {label}
                    </h3>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {list.map((a) => (
                        <li key={a.id}>
                          <Link
                            href={`/news/${a.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-globalist-black hover:underline"
                          >
                            {a.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
            )}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-sm font-medium text-globalist-gray-700">Category</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded border border-globalist-gray-300 px-3 py-2 text-sm text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
          >
            <option value="">All</option>
            {categories.filter(Boolean).map((c) => (
              <option key={c} value={c}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-globalist-gray-500">Loading…</p>
      ) : articles.length === 0 ? (
        <p className="mt-6 text-sm text-globalist-gray-500">
          No articles yet.{' '}
          <Link href="/admin/new" className="text-globalist-gray-700 underline hover:no-underline">
            Create one
          </Link>
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded border border-globalist-gray-200 bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-globalist-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-globalist-black">Title</th>
                <th className="px-4 py-3 text-left font-medium text-globalist-black">Category</th>
                <th className="px-4 py-3 text-left font-medium text-globalist-black">Date</th>
                <th className="px-4 py-3 text-left font-medium text-globalist-black">Homepage section</th>
                <th className="px-4 py-3 text-left font-medium text-globalist-black">Status</th>
                <th className="px-4 py-3 text-left font-medium text-globalist-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-globalist-gray-200">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-globalist-gray-50">
                  <td className="px-4 py-3">
                    <Link
                      href={`/news/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-globalist-black hover:text-globalist-gray-600 hover:underline"
                    >
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-globalist-gray-600">{a.category}</td>
                  <td className="px-4 py-3 text-globalist-gray-600">
                    {new Date(a.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleHomepage(a.id, !!a.show_on_homepage)}
                      disabled={togglingId === a.id}
                      className={`rounded px-2 py-1 text-xs font-medium ${
                        a.show_on_homepage
                          ? 'bg-globalist-gray-700 text-white hover:bg-globalist-gray-500'
                          : 'bg-globalist-gray-200 text-globalist-gray-700 hover:bg-globalist-gray-300'
                      } disabled:opacity-50`}
                    >
                      {togglingId === a.id ? '…' : a.show_on_homepage ? 'Yes' : 'No'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {isLegacy(a.created_at) && (
                      <span className="rounded bg-globalist-gray-300 px-2 py-0.5 text-xs text-globalist-gray-700">
                        Legacy
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/news/${a.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-globalist-gray-600 hover:text-globalist-black hover:underline"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-4 text-xs text-globalist-gray-500">
        Articles older than 24 hours are marked Legacy. Assign a homepage section so each article appears in only one place on the homepage.
      </p>
    </div>
  );
}
