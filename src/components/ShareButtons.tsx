'use client';

export function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="mt-8 border-t border-globalist-gray-200 pt-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-globalist-gray-500">
        Share
      </p>
      <div className="mt-2 flex gap-4">
        <a
          href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-bloomberg-blue hover:underline"
        >
          Twitter
        </a>
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-bloomberg-blue hover:underline"
        >
          LinkedIn
        </a>
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-bloomberg-blue hover:underline"
        >
          Facebook
        </a>
      </div>
    </div>
  );
}
