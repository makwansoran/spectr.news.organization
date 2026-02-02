'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { VantaTopologyBg } from '@/components/vanta-topology-bg';

function SignUpForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const supabase = createClient();
      if (!supabase) {
        setError('Sign-up is not configured yet. Add Supabase URL and anon key to .env.local.');
        setLoading(false);
        return;
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      if (signUpError) {
        setError(signUpError.message || 'Could not create account');
        setLoading(false);
        return;
      }
      setSuccess(true);
      setLoading(false);
      router.refresh();
    } catch {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  }

  const supabaseForCheck = createClient();
  if (!supabaseForCheck) {
    return (
      <div className="min-h-screen text-black flex flex-col relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 45%)' }}>
            <VantaTopologyBg />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-sky-50/90 to-indigo-50/95"
            style={{ clipPath: 'polygon(0 45%, 100% 55%, 100% 100%, 0 100%)' }}
          />
        </div>
        <Link href="/" className="absolute top-6 left-6 z-10 text-xl font-semibold tracking-tight text-white hover:opacity-90 transition-opacity">
          Spectr
        </Link>
        <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 min-h-screen">
          <div className="w-full max-w-[400px]">
            <div className="rounded-lg border border-black/[0.08] bg-white/95 shadow-sm shadow-black/[0.04] p-8">
              <h1 className="text-xl font-semibold tracking-tight text-black">Create account</h1>
              <p className="mt-1.5 text-sm text-black/55">Sign-up will be available once you add Supabase to .env.local.</p>
              <Link href="/login" className="mt-6 block text-center text-sm font-medium text-blue-600 hover:text-blue-700">
                Already have an account? Sign in
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen text-black flex flex-col relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 55%, 0 45%)' }}>
            <VantaTopologyBg />
          </div>
          <div
            className="absolute inset-0 bg-gradient-to-br from-blue-50/95 via-sky-50/90 to-indigo-50/95"
            style={{ clipPath: 'polygon(0 45%, 100% 55%, 100% 100%, 0 100%)' }}
          />
        </div>
        <Link href="/" className="absolute top-6 left-6 z-10 text-xl font-semibold tracking-tight text-white hover:opacity-90 transition-opacity">
          Spectr
        </Link>
        <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 min-h-screen">
          <div className="w-full max-w-[400px]">
            <div className="rounded-lg border border-black/[0.08] bg-white/95 shadow-sm shadow-black/[0.04] p-8">
              <h1 className="text-xl font-semibold tracking-tight text-black">Check your email</h1>
              <p className="mt-1.5 text-sm text-black/55">
                We sent a confirmation link to <strong>{email}</strong>. Click it to confirm your account, then sign in.
              </p>
              <Link
                href="/login"
                className="mt-6 block w-full rounded-md bg-blue-600 px-3 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Sign in
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-black flex flex-col relative overflow-hidden">
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
        Spectr
      </Link>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 min-h-screen">
        <div className="w-full max-w-[400px]">
          <div className="rounded-lg border border-black/[0.08] bg-white/95 shadow-sm shadow-black/[0.04] p-8">
            <h1 className="text-xl font-semibold tracking-tight text-black">Create account</h1>
            <p className="mt-1.5 text-sm text-black/55">Enter your name, email and password to continue</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">Name</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="input-signin"
                />
              </div>
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
                <label htmlFor="password" className="block text-sm font-medium text-black mb-2">Password</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="input-signin"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md bg-blue-600 px-3 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating account…' : 'Create account'}
              </button>
              <p className="text-center text-sm text-black/60 mt-5">
                Already have an account? <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">Sign in</Link>
              </p>
            </form>
          </div>
          <p className="mt-6 text-center text-xs text-black/45">By creating an account you agree to our terms of service and privacy policy.</p>
        </div>
      </main>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-black">Loading…</div>}>
      <SignUpForm />
    </Suspense>
  );
}
