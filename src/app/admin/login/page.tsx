'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

function EditorLoginForm() {
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/admin';
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/editor-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }
      window.location.href = from;
    } catch {
      setError('Network error');
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col justify-center px-4 py-12">
      <Link href="/" className="text-sm font-medium text-bloomberg-blue hover:underline">
        ← Home
      </Link>
      <h1 className="mt-6 text-2xl font-bold text-globalist-black">
        Editor&apos;s Desk login
      </h1>
      <p className="mt-1 text-sm text-globalist-gray-600">
        Staff only. Enter editor username and password to access the admin area.
      </p>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-globalist-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="Editor username"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-globalist-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black focus:border-bloomberg-blue focus:outline-none focus:ring-1 focus:ring-bloomberg-blue"
            placeholder="Editor password"
          />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-bloomberg-blue py-3 text-sm font-semibold text-white hover:bg-globalist-gray-500 active:bg-globalist-gray-600 disabled:opacity-50"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-sm px-4 py-12">Loading…</div>}>
      <EditorLoginForm />
    </Suspense>
  );
}
