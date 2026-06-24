'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    if (session) {
      fetch('/api/notifications').then(res => res.json()).then(setNotifs);
    }
  }, [session]);

  if (!session) return <p className="p-8">Please sign in.</p>;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {notifs.length === 0 && <p>No notifications yet.</p>}
      {notifs.map(n => (
        <div key={n.id} className={`p-3 border-b ${n.read ? 'opacity-60' : ''}`}>
          <p>{n.message}</p>
          <span className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}