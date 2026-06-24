'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function FollowButton({ userId, initialFollowing }) {
  const { data: session } = useSession();
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (!session) return;
    setLoading(true);
    const res = await fetch('/api/user/follow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followingId: userId }),
    });
    if (res.ok) {
      const data = await res.json();
      setFollowing(data.following);
    }
    setLoading(false);
  };

  // Don't show button if viewing own profile
  if (session?.user?.id === userId) return null;

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-5 py-2 rounded-full text-sm font-medium transition ${
        following
          ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300 border border-pink-300 dark:border-pink-700'
          : 'bg-pink-500 text-white hover:bg-pink-600 shadow-md'
      }`}
    >
      {loading ? '...' : following ? 'Following' : 'Follow'}
    </button>
  );
}