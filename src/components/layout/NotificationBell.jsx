'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { HiBell } from 'react-icons/hi';

export default function NotificationBell() {
  const { data: session } = useSession();
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!session) return;
    const fetchUnread = async () => {
      const res = await fetch('/api/notifications/unread-count');
      const data = await res.json();
      setUnread(data.count);
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [session]);

  return (
    <Link href="/notifications" className="relative">
      <HiBell size={22} />
      {unread > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
          {unread}
        </span>
      )}
    </Link>
  );
}