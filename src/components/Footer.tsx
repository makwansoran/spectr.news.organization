import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-globalist-gray-200 bg-globalist-gray-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/" className="text-xl font-semibold text-globalist-black sm:text-2xl hover:text-bloomberg-blue">
            spectr
          </Link>
          <nav className="flex flex-wrap items-center gap-6 text-sm text-globalist-gray-600">
            <Link href="/politics" className="hover:text-bloomberg-blue">Politics</Link>
            <Link href="/finance" className="hover:text-bloomberg-blue">Finance</Link>
            <Link href="/economy" className="hover:text-bloomberg-blue">Economy</Link>
            <Link href="/companies" className="hover:text-bloomberg-blue">Companies</Link>
            <Link href="/subscribe" className="hover:text-bloomberg-blue">Subscribe</Link>
            <Link href="/admin" className="hover:text-bloomberg-blue">Editor&apos;s Desk</Link>
          </nav>
        </div>
        <p className="mt-4 text-xs text-globalist-gray-600">
          © {new Date().getFullYear()} spectr. All voices matter.
        </p>
      </div>
    </footer>
  );
}
