'use client';

import { useState } from 'react';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    if (newPassword !== confirmPassword) {
      setStatus('error');
      setMessage('New password and confirm do not match.');
      return;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/auth/editor-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Failed to update password');
        return;
      }
      setStatus('success');
      setMessage('Password updated. Use it next time you log in.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setStatus('error');
      setMessage('Network error');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-globalist-black">Settings</h1>
      <p className="mt-1 text-sm text-globalist-gray-600">
        Editor&apos;s Desk login is stored in the database. Change your password here.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 max-w-md space-y-4">
        <div>
          <label htmlFor="current" className="block text-sm font-medium text-globalist-gray-700">
            Current password
          </label>
          <input
            id="current"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black"
          />
        </div>
        <div>
          <label htmlFor="new" className="block text-sm font-medium text-globalist-gray-700">
            New password
          </label>
          <input
            id="new"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black"
          />
          <p className="mt-1 text-xs text-globalist-gray-500">At least 8 characters</p>
        </div>
        <div>
          <label htmlFor="confirm" className="block text-sm font-medium text-globalist-gray-700">
            Confirm new password
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 w-full rounded border border-globalist-gray-300 px-3 py-2 text-globalist-black"
          />
        </div>
        {message && (
          <p className={`text-sm ${status === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {message}
          </p>
        )}
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded bg-globalist-black px-4 py-2 text-sm font-medium text-white hover:bg-globalist-gray-800 disabled:opacity-50"
        >
          {status === 'sending' ? 'Updating…' : 'Change password'}
        </button>
      </form>
    </div>
  );
}
