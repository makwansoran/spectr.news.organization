'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminNav } from './AdminNav';
import { SignOutButton } from './SignOutButton';

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-globalist-gray-50">
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-globalist-gray-50">
      <header className="border-b border-globalist-gray-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="text-lg font-bold text-globalist-black hover:text-globalist-gray-700"
            >
              Editor&apos;s Desk
            </Link>
            <AdminNav />
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm text-globalist-gray-500 hover:text-globalist-gray-700"
            >
              View site
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
