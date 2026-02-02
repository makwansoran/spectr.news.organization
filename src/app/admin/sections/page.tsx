'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  homepage_section?: string | null;
};

const SECTIONS = [
  { value: 'featured', label: 'Featured', slots: 1 },
  { value: 'breaking', label: 'Breaking', slots: 10 },
  { value: 'trending', label: 'Trending', slots: 4 },
  { value: 'popular', label: 'Popular', slots: 4 },
  { value: 'editor_choice', label: "Editor's Choice", slots: 3 },
  { value: 'worth_reading', label: 'Worth Reading', slots: 5 },
] as const;

const SECTION_OPTIONS = [
  { value: '', label: '— Not on homepage' },
  ...SECTIONS.map((s) => ({ value: s.value, label: s.label })),
];

export default function AdminSectionsPage() {
  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/articles?limit=100')
      .then((r) => r.json())
      .then((data) => setArticles(Array.isArray(data) ? data : []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  const setArticleSection = async (id: string, section: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ homepage_section: section || null }),
      });
      if (res.ok) {
        const newSection = section || null;
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, homepage_section: newSection } : a))
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const bySection = SECTIONS.map(({ value, label, slots }) => ({
    value,
    label,
    slots,
    articles: articles.filter((a) => (a.homepage_section || '') === value),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-globalist-black">Homepage sections</h1>
      <p className="mt-1 text-sm text-globalist-gray-600">
        Put each article in exactly one section. An article appears in only one place on the homepage—no duplicates.
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-globalist-gray-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-6">
          {bySection.map(({ value, label, slots, articles: list }) => (
            <div
              key={value}
              className="rounded-lg border border-globalist-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-globalist-black">
                  {label}
                </h2>
                <span className="text-xs text-globalist-gray-500">
                  {list.length} / {slots} slot{slots !== 1 ? 's' : ''}
                </span>
              </div>
              {list.length === 0 ? (
                <p className="text-sm text-globalist-gray-500">No articles in this section.</p>
              ) : (
                <ul className="space-y-2">
                  {list.map((a) => (
                    <li
                      key={a.id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded border border-globalist-gray-100 bg-globalist-gray-50/50 px-3 py-2"
                    >
                      <Link
                        href={`/news/${a.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 min-w-0 font-medium text-globalist-black hover:underline"
                      >
                        {a.title}
                      </Link>
                      <select
                        value={a.homepage_section ?? ''}
                        onChange={(e) => setArticleSection(a.id, e.target.value)}
                        disabled={updatingId === a.id}
                        className="rounded border border-globalist-gray-300 bg-white px-2 py-1 text-xs text-globalist-black disabled:opacity-50"
                        title="Change section"
                      >
                        {SECTION_OPTIONS.map((opt) => (
                          <option key={opt.value || 'none'} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-xs text-globalist-gray-500">
                To add an article here, go to <Link href="/admin/articles" className="underline">All articles</Link> and set &quot;Homepage section&quot; to {label}, or set it when creating a <Link href="/admin/new" className="underline">New article</Link>.
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
