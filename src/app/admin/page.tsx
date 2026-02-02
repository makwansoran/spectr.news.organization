import Link from 'next/link';
import { AdminStats } from './AdminStats';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-globalist-black">Dashboard</h1>
      <p className="mt-1 text-sm text-globalist-gray-600">
        Choose a section below to create or manage articles.
      </p>
      <AdminStats />
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Link
          href="/admin/new"
          className="rounded-lg border border-globalist-gray-200 bg-white p-6 shadow-sm transition hover:border-globalist-gray-300 hover:shadow"
        >
          <h2 className="text-lg font-semibold text-globalist-black">
            Create new article
          </h2>
          <p className="mt-2 text-sm text-globalist-gray-600">
            Write and publish a new story. Set category, excerpt, featured image, and whether it appears on the homepage.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-globalist-gray-700 hover:underline">
            New article →
          </span>
        </Link>
        <Link
          href="/admin/articles"
          className="rounded-lg border border-globalist-gray-200 bg-white p-6 shadow-sm transition hover:border-globalist-gray-300 hover:shadow"
        >
          <h2 className="text-lg font-semibold text-globalist-black">
            Manage all articles
          </h2>
          <p className="mt-2 text-sm text-globalist-gray-600">
            View, filter, and manage existing articles. Toggle &quot;Show on homepage&quot; and open articles to edit or view.
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-globalist-gray-700 hover:underline">
            All articles →
          </span>
        </Link>
      </div>
    </div>
  );
}
