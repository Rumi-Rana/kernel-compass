'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import PostCard from '@/components/blog/PostCard';

export default function SavedPage() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('/api/bookmarks/list').then(res => res.json()).then(setPosts);
    }
  }, [session]);

  if (!session) return <p className="p-8">Sign in to see saved articles.</p>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Saved Articles</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {posts.map(p => <PostCard key={p.id} post={p} />)}
      </div>
      {posts.length === 0 && <p>No saved articles.</p>}
    </div>
  );
}