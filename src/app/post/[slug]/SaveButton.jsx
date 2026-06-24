'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function SaveButton({ postId, initialSaved }) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!session) return;
    setLoading(true);
    const res = await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ postId }),
    });
    if (res.ok) {
      const data = await res.json();
      setSaved(data.bookmarked);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium transition ${
        saved
          ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-pink-900/30'
      }`}
      title={saved ? 'Unsave' : 'Save for later'}
    >
      {saved ? '❤️ Saved' : '🤍 Save'}
    </button>
  );
}