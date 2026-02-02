'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { VantaTopologyBg } from '@/components/vanta-topology-bg';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const errorParam = searchParams.get('error');
  const messageParam = searchParams.get('message');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const supabase = createClient();
    if (!supabase) {
      setError('Sign-in is not configured yet. Add Supabase URL and anon key to .env.local.');
      setLoading(false);
      return;
    }
    const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message === 'Invalid login credentials' ? 'Invalid email or password.' : signInError.message);
      return;
    }
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen text-black flex flex-col relative overflow-hidden">
      {/* Background: upper = Vanta TOPOLOGY (dark + blue mesh), lower = blue gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 45%)' }}>
          <VantaTopologyBg />
        </div>
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-sky-50/90 to-indigo-50/95"
          style={{ clipPath: 'polygon(0 45%, 100% 55%, 100% 100%, 0 100%)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'linear-gradient(135deg, transparent 48%, rgba(0,0,0,0.06) 50%, transparent 52%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 45%)',
          }}
        />
      </div>

      <Link href="/" className="absolute top-6 left-6 z-10 text-xl font-semibold tracking-tight text-white hover:opacity-90 transition-opacity">
        spectr
      </Link>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 min-h-screen">
        <div className="w-full max-w-[400px]">
          <div className="rounded-lg border border-black/[0.08] bg-white/95 shadow-sm shadow-black/[0.04] p-8">
            <h1 className="text-xl font-semibold tracking-tight text-black">Sign in to your account</h1>
            <p className="mt-1.5 text-sm text-black/55">Enter your email and password to continue</p>

            {errorParam === 'auth_callback' && (
              <p className="mt-4 rounded-md bg-red-50 px-3 py-2.5 text-sm text-red-600 border border-red-100">
                Sign-in link expired or invalid. Please sign in again.
              </p>
            )}
            {messageParam === 'reset' && (
              <p className="mt-4 rounded-md bg-blue-50 px-3 py-2.5 text-sm text-blue-700 border border-blue-100">
                Check your email for a link to reset your password.
              </p>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">Email</label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="input-signin"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-black">Password</label>
                  <Link href="/login/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot password?</Link>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-signin"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Signing in…' : 'Sign in'}
              </button>
              <p className="text-center text-sm text-black/60 mt-5">
                Don&apos;t have an account? <Link href="/sign-up" className="font-medium text-blue-600 hover:text-blue-700">Create account</Link>
              </p>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-black/45">By signing in you agree to our terms of service and privacy policy.</p>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-black">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
