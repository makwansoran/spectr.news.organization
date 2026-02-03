'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import clsx from 'clsx';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

const NAV_LINKS = [
  { href: '/', label: 'HOME' },
  { href: '/politics', label: 'POLITICS' },
  { href: '/economy', label: 'ECONOMY' },
  { href: '/trade', label: 'TRADE' },
  { href: '/companies', label: 'COMPANIES' },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    if (supabase) await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 bg-globalist-black text-globalist-white">
      {/* Top bar: hamburger + logo left, Sign In + Subscribe right */}
      <div className="flex items-center justify-between border-b border-globalist-gray-700 px-4 py-2 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 text-globalist-gray-400 hover:text-white md:hidden"
            aria-label="Menu"
            onClick={() => setOpen(!open)}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="text-xl font-semibold text-white sm:text-2xl hover:text-globalist-gray-200">
            spectr
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden truncate max-w-[120px] text-sm text-globalist-gray-400 sm:inline" title={user.email ?? undefined}>
                {user.email}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded bg-globalist-white px-4 py-1.5 text-sm font-medium text-globalist-black hover:bg-globalist-gray-300 active:bg-globalist-gray-400"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-globalist-gray-300 hover:text-white">
              Sign In
            </Link>
          )}
          <Link
            href="/subscribe"
            className="rounded bg-globalist-white px-4 py-1.5 text-sm font-medium text-globalist-black hover:bg-globalist-gray-300 active:bg-globalist-gray-400"
          >
            Subscribe Now
          </Link>
        </div>
      </div>
      {/* Nav bar: search left, links center, EN right */}
      <div className="hidden items-center justify-between border-b border-globalist-gray-700 px-4 py-2 sm:px-6 md:flex">
        <button type="button" className="p-2 text-globalist-gray-400 hover:text-white" aria-label="Search">
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <nav className="flex items-center gap-4 lg:gap-6">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'text-xs font-medium uppercase tracking-wide transition-colors lg:text-sm',
                pathname === href ? 'text-white' : 'text-globalist-gray-300 hover:text-white'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1 text-sm text-globalist-gray-400">
          EN
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {open && (
        <div className="border-t border-globalist-gray-700 bg-globalist-black px-4 py-3 md:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block py-2 text-sm text-globalist-gray-300 hover:text-white"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
