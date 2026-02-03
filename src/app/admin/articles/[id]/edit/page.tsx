'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

const CATEGORIES = [
  { value: 'politics', label: 'Politics' },
  { value: 'finance', label: 'Finance' },
  { value: 'economy', label: 'Economy' },
  { value: 'trade', label: 'Trade' },
  { value: 'companies', label: 'Companies' },
  { value: 'breaking', label: 'Breaking' },
] as const;

type Article = {
  id: string;
  slug: string;
  title: string;
  subheadline: string | null;
  category: string;
  excerpt: string | null;
  body: string;
  featured_image_url: string | null;
  author_name: string | null;
  author_email: string | null;
  author_position: string | null;
  author_avatar_url: string | null;
  is_breaking: boolean;
  is_premium: boolean;
  show_on_homepage?: boolean;
  homepage_section: string | null;
};

export default function AdminEditArticlePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === 'string' ? params.id : '';

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [title, setTitle] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [category, setCategory] = useState<string>('politics');
  const [excerpt, setExcerpt] = useState('');
  const [body, setBody] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [authorPosition, setAuthorPosition] = useState('');
  const [authorAvatarUrl, setAuthorAvatarUrl] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [homepageSection, setHomepageSection] = useState<string>('');
  const [slug, setSlug] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [authorAvatarUploading, setAuthorAvatarUploading] = useState(false);
  const [authorAvatarError, setAuthorAvatarError] = useState('');

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setNotFound(true);
      return;
    }
    fetch(`/api/articles/${id}`, { credentials: 'include' })
      .then((r) => {
        if (r.status === 404) {
          setNotFound(true);
          return null;
        }
        return r.json();
      })
      .then((data: Article | null) => {
        if (!data) return;
        setTitle(data.title);
        setSubheadline(data.subheadline ?? '');
        setCategory(data.category);
        setExcerpt(data.excerpt ?? '');
        setBody(data.body);
        setFeaturedImageUrl(data.featured_image_url ?? '');
        setAuthorName(data.author_name ?? '');
        setAuthorEmail(data.author_email ?? '');
        setAuthorPosition(data.author_position ?? '');
        setAuthorAvatarUrl(data.author_avatar_url ?? '');
        setIsBreaking(data.is_breaking);
        setIsPremium(data.is_premium);
        setHomepageSection(data.homepage_section ?? '');
        setSlug(data.slug);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subheadline: subheadline || null,
          category,
          excerpt: excerpt || null,
          body,
          featured_image_url: featuredImageUrl || null,
          author_name: authorName || null,
          author_email: authorEmail || null,
          author_position: authorPosition || null,
          author_avatar_url: authorAvatarUrl || null,
          is_breaking: isBreaking,
          is_premium: isPremium,
          homepage_section: homepageSection || null,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to update article');
        return;
      }
      setStatus('success');
      setMessage('Article updated. Redirecting…');
      setTimeout(() => router.push('/admin/articles'), 1000);
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Network error');
    }
  };

  if (loading) {
    return (
      <div>
        <p className="text-globalist-gray-600">Loading article…</p>
      </div>
    );
  }

  if (notFound || !id) {
    return (
      <div>
        <p className="text-red-600">Article not found.</p>
        <Link href="/admin/articles" className="mt-2 inline-block text-sm text-bloomberg-blue hover:underline">
          ← Back to articles
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Link href="/admin/articles" className="text-sm text-globalist-gray-600 hover:text-globalist-black hover:underline">
          ← Articles
        </Link>
        <span className="text-globalist-gray-400">/</span>
        <span className="text-sm font-medium text-globalist-black">Edit article</span>
      </div>
      <h1 className="text-2xl font-bold text-globalist-black">Edit article</h1>
      <p className="mt-1 text-sm text-globalist-gray-600">
        URL: /news/{slug} (slug is not changed when editing)
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-globalist-gray-700">
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="Headline"
          />
        </div>

        <div>
          <label htmlFor="subheadline" className="block text-sm font-medium text-globalist-gray-700">
            Subheadline
          </label>
          <input
            id="subheadline"
            type="text"
            value={subheadline}
            onChange={(e) => setSubheadline(e.target.value)}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="Supporting line under the headline"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-globalist-gray-700">
            Category *
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-globalist-gray-700">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="Short summary for cards and SEO"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-globalist-gray-700">
            Featured image
          </label>
          <p className="mt-1 text-xs text-globalist-gray-500">
            Paste an image URL or upload.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <input
              type="url"
              value={featuredImageUrl}
              onChange={(e) => { setFeaturedImageUrl(e.target.value); setUploadError(''); }}
              className="flex-1 min-w-0 rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          {featuredImageUrl && (
            <div className="mt-2 h-24 w-40 overflow-hidden rounded border border-globalist-gray-200 bg-globalist-gray-100">
              <img src={featuredImageUrl} alt="" className="h-full w-full object-cover" />
            </div>
          )}
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-globalist-gray-700">
            Author name
          </label>
          <input
            id="author"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="Journalist full name"
          />
        </div>

        <div>
          <label htmlFor="author_position" className="block text-sm font-medium text-globalist-gray-700">
            Author position
          </label>
          <input
            id="author_position"
            type="text"
            value={authorPosition}
            onChange={(e) => setAuthorPosition(e.target.value)}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="e.g. Senior correspondent, Editor"
          />
        </div>

        <div>
          <label htmlFor="author_email" className="block text-sm font-medium text-globalist-gray-700">
            Author email
          </label>
          <input
            id="author_email"
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="journalist@spectr.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-globalist-gray-700">
            Author profile picture URL
          </label>
          <input
            type="url"
            value={authorAvatarUrl}
            onChange={(e) => setAuthorAvatarUrl(e.target.value)}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="https://..."
          />
          {authorAvatarUrl && (
            <div className="mt-2 h-12 w-12 overflow-hidden rounded-full border border-globalist-gray-200 bg-globalist-gray-100">
              <img src={authorAvatarUrl} alt="" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-globalist-gray-700">
            Body (Rich Text) *
          </label>
          <div className="mt-1 rounded border border-globalist-gray-300 focus-within:border-bloomberg-blue focus-within:ring-1 focus-within:ring-bloomberg-blue">
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              placeholder="Write your article..."
              className="[&_.ql-toolbar]:rounded-t [&_.ql-container]:rounded-b [&_.ql-editor]:min-h-[280px]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isBreaking}
              onChange={(e) => setIsBreaking(e.target.checked)}
              className="rounded border-globalist-gray-300 text-bloomberg-blue focus:ring-bloomberg-blue"
            />
            <span className="text-sm text-globalist-gray-700">Breaking news</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="rounded border-globalist-gray-300 text-bloomberg-blue focus:ring-bloomberg-blue"
            />
            <span className="text-sm text-globalist-gray-700">Premium (paywall)</span>
          </label>
        </div>

        <div>
          <label htmlFor="homepage_section" className="block text-sm font-medium text-globalist-gray-700">
            Homepage section
          </label>
          <select
            id="homepage_section"
            value={homepageSection}
            onChange={(e) => setHomepageSection(e.target.value)}
            className="mt-2 w-full max-w-xs rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
          >
            <option value="">Not on homepage</option>
            <option value="featured">Featured (hero, 1 slot)</option>
            <option value="breaking">Breaking (list + large, up to 10)</option>
            <option value="trending">Trending (row, 4 slots)</option>
            <option value="popular">Popular (grid, 4 slots)</option>
            <option value="editor_choice">Editor&apos;s Choice (3 slots)</option>
            <option value="worth_reading">Worth Reading (list, 5 slots)</option>
          </select>
        </div>

        {message && (
          <p
            className={`text-sm ${
              status === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded bg-globalist-gray-700 px-6 py-3 text-sm font-semibold text-white hover:bg-globalist-gray-500 active:bg-globalist-gray-600 disabled:opacity-50"
        >
          {status === 'sending' ? 'Saving…' : 'Update article'}
        </button>
      </form>
    </div>
  );
}
