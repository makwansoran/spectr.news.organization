'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { supabase } from '@/lib/supabase';

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

export default function AdminNewArticlePage() {
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
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [authorAvatarUploading, setAuthorAvatarUploading] = useState(false);
  const [authorAvatarError, setAuthorAvatarError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setMessage('');
    try {
      const res = await fetch('/api/articles/post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        const errMsg = data?.error || `Failed to create article (${res.status})`;
        setMessage(errMsg);
        return;
      }
      setStatus('success');
      setMessage('Article published at /news/' + (data.slug ?? '') + ' — URL was generated from the title.');
      setTitle('');
      setSubheadline('');
      setExcerpt('');
      setBody('');
      setFeaturedImageUrl('');
      setAuthorName('');
      setAuthorEmail('');
      setAuthorPosition('');
      setAuthorAvatarUrl('');
      setIsBreaking(false);
      setIsPremium(false);
      setHomepageSection('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Network error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-globalist-black">Create new article</h1>
      <p className="mt-1 text-sm text-globalist-gray-600">
        Publish a new story. The article URL is generated automatically from the title.
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
          <p className="mt-1 text-xs text-globalist-gray-500">
            The URL will be generated from this title (e.g. /news/my-article-title).
          </p>
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
            Paste an image URL or upload. URL works with any public image (Imgur, Unsplash, your CDN, etc.).
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <input
              type="url"
              value={featuredImageUrl}
              onChange={(e) => { setFeaturedImageUrl(e.target.value); setUploadError(''); }}
              className="flex-1 min-w-0 rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
              placeholder="https://example.com/image.jpg"
            />
            <span className="text-globalist-gray-400">or</span>
            <label className="cursor-pointer rounded border border-globalist-gray-300 bg-white px-3 py-2 text-sm font-medium text-globalist-gray-700 hover:bg-globalist-gray-50 focus-within:ring-2 focus-within:ring-bloomberg-blue">
              {uploading ? 'Uploading…' : 'Upload image'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/avif,image/tiff,image/x-icon,image/vnd.microsoft.icon"
                className="sr-only"
                disabled={uploading}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setUploadError('');
                  if (f.size > 10 * 1024 * 1024) {
                    setUploadError('File too large. Maximum size is 10MB.');
                    e.target.value = '';
                    return;
                  }
                  setUploading(true);
                  try {
                    if (!supabase) {
                      if (f.size > 4 * 1024 * 1024) {
                        setUploadError('File too large. Max 4MB when Supabase is not set in the browser. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel and redeploy for larger files.');
                        return;
                      }
                      const form = new FormData();
                      form.append('file', f);
                      const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok && data.url) {
                        setFeaturedImageUrl(data.url);
                        return;
                      }
                      throw new Error(data.error || `Upload failed (${res.status})`);
                    }
                    if (f.size <= 4 * 1024 * 1024) {
                      const form = new FormData();
                      form.append('file', f);
                      const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok && data.url) {
                        setFeaturedImageUrl(data.url);
                        return;
                      }
                    }
                    const urlRes = await fetch('/api/upload-url', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ contentType: f.type || 'image/jpeg' }),
                      credentials: 'include',
                    });
                    const urlData = await urlRes.json().catch(() => ({}));
                    if (urlData?.useServerUpload && f.size <= 4 * 1024 * 1024) {
                      const form = new FormData();
                      form.append('file', f);
                      const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok && data.url) {
                        setFeaturedImageUrl(data.url);
                        return;
                      }
                      throw new Error(data.error || `Upload failed (${res.status})`);
                    }
                    if (urlData?.useServerUpload) throw new Error('File too large. Max 4MB when Supabase URL is not set on the server.');
                    if (!urlRes.ok) throw new Error(urlData.error || 'Could not get upload path');
                    const { path: uploadPath, publicUrl } = urlData;
                    if (!uploadPath || !publicUrl) throw new Error('Invalid response');
                    const { error: uploadErr } = await supabase.storage
                      .from('uploads')
                      .upload(uploadPath, f, { contentType: f.type || 'image/jpeg', upsert: false });
                    if (uploadErr) throw new Error(uploadErr.message);
                    setFeaturedImageUrl(publicUrl);
                  } catch (err) {
                    setUploadError(err instanceof Error ? err.message : 'Upload failed');
                  } finally {
                    setUploading(false);
                    e.target.value = '';
                  }
                }}
              />
            </label>
            {featuredImageUrl && (
              <div className="h-24 w-40 shrink-0 overflow-hidden rounded border border-globalist-gray-200 bg-globalist-gray-100">
                <img src={featuredImageUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
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
            Author profile picture
          </label>
          <p className="mt-1 text-xs text-globalist-gray-500">
            Optional. Upload or paste a URL (square image works best).
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <input
              type="url"
              value={authorAvatarUrl}
              onChange={(e) => { setAuthorAvatarUrl(e.target.value); setAuthorAvatarError(''); }}
              className="flex-1 min-w-0 rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
              placeholder="https://... or upload"
            />
            <label className="cursor-pointer rounded border border-globalist-gray-300 bg-white px-3 py-2 text-sm font-medium text-globalist-gray-700 hover:bg-globalist-gray-50 focus-within:ring-2 focus-within:ring-bloomberg-blue">
              {authorAvatarUploading ? 'Uploading…' : 'Upload'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp,image/avif,image/tiff,image/x-icon,image/vnd.microsoft.icon"
                className="sr-only"
                disabled={authorAvatarUploading}
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setAuthorAvatarError('');
                  if (f.size > 10 * 1024 * 1024) {
                    setAuthorAvatarError('File too large. Maximum size is 10MB.');
                    e.target.value = '';
                    return;
                  }
                  setAuthorAvatarUploading(true);
                  try {
                    if (!supabase) {
                      if (f.size > 4 * 1024 * 1024) {
                        setAuthorAvatarError('File too large. Max 4MB. Add NEXT_PUBLIC_SUPABASE_* in Vercel and redeploy for larger files.');
                        return;
                      }
                      const form = new FormData();
                      form.append('file', f);
                      const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok && data.url) {
                        setAuthorAvatarUrl(data.url);
                        return;
                      }
                      throw new Error(data.error || `Upload failed (${res.status})`);
                    }
                    if (f.size <= 4 * 1024 * 1024) {
                      const form = new FormData();
                      form.append('file', f);
                      const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok && data.url) {
                        setAuthorAvatarUrl(data.url);
                        return;
                      }
                    }
                    const urlRes = await fetch('/api/upload-url', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ contentType: f.type || 'image/jpeg' }),
                      credentials: 'include',
                    });
                    const urlData = await urlRes.json().catch(() => ({}));
                    if (urlData?.useServerUpload && f.size <= 4 * 1024 * 1024) {
                      const form = new FormData();
                      form.append('file', f);
                      const res = await fetch('/api/upload', { method: 'POST', body: form, credentials: 'include' });
                      const data = await res.json().catch(() => ({}));
                      if (res.ok && data.url) {
                        setAuthorAvatarUrl(data.url);
                        return;
                      }
                      throw new Error(data.error || `Upload failed (${res.status})`);
                    }
                    if (urlData?.useServerUpload) throw new Error('File too large. Max 4MB when Supabase URL is not set on the server.');
                    if (!urlRes.ok) throw new Error(urlData.error || 'Could not get upload path');
                    const { path: uploadPath, publicUrl } = urlData;
                    if (!uploadPath || !publicUrl) throw new Error('Invalid response');
                    const { error: uploadErr } = await supabase.storage
                      .from('uploads')
                      .upload(uploadPath, f, { contentType: f.type || 'image/jpeg', upsert: false });
                    if (uploadErr) throw new Error(uploadErr.message);
                    setAuthorAvatarUrl(publicUrl);
                  } catch (err) {
                    setAuthorAvatarError(err instanceof Error ? err.message : 'Upload failed');
                  } finally {
                    setAuthorAvatarUploading(false);
                    e.target.value = '';
                  }
                }}
              />
            </label>
            {authorAvatarUrl && (
              <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-globalist-gray-200 bg-globalist-gray-100">
                <img src={authorAvatarUrl} alt="" className="h-full w-full object-cover" />
              </div>
            )}
          </div>
          {authorAvatarError && <p className="mt-1 text-sm text-red-600">{authorAvatarError}</p>}
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
          <p className="mt-1 text-xs text-globalist-gray-500">
            Each article appears in only one section. No duplicates across the homepage.
          </p>
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
          {status === 'sending' ? 'Publishing…' : 'Publish article'}
        </button>
      </form>
    </div>
  );
}
