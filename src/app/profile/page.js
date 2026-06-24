'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetch(`/api/user/${session.user.id}`).then(res => res.json()).then(setUser);
    }
  }, [session]);

  if (!user) return <p className="p-8">Loading...</p>;

  return (
    <div className="max-w-md mx-auto py-8 text-center">
      <img src={user.image || '/avatar-placeholder.png'} className="w-24 h-24 rounded-full mx-auto object-cover" />
      <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
      <p className="text-gray-600 dark:text-gray-400">{user.bio}</p>
      <div className="mt-4">
        <Link href="/settings" className="text-indigo-600 hover:underline">Edit Profile</Link>
      </div>
    </div>
  );
}