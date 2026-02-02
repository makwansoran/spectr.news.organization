'use client';

export function SignOutButton() {
  async function handleSignOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  }
  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="rounded px-3 py-2 text-sm font-medium text-globalist-gray-600 hover:bg-globalist-gray-100 hover:text-globalist-black"
    >
      Sign out
    </button>
  );
}
