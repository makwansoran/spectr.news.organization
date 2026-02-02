'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin/new', label: 'New article' },
  { href: '/admin/articles', label: 'All articles' },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1" aria-label="Admin sections">
      {links.map(({ href, label }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`rounded px-3 py-2 text-sm font-medium ${
              isActive
                ? 'bg-globalist-gray-100 text-globalist-black'
                : 'text-globalist-gray-600 hover:bg-globalist-gray-100 hover:text-globalist-black'
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
