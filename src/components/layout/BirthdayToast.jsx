'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function BirthdayToast() {
  const { data: session } = useSession();

  useEffect(() => {
    async function checkBirthday() {
      if (!session?.user?.id) return;
      const res = await fetch('/api/birthday/check');
      const data = await res.json();
      if (data.isBirthday && !data.alreadyWished) {
        toast.success(`🎂 ${data.message}`, {
          duration: 6000,
          style: {
            background: '#4f46e5',
            color: '#fff',
            fontWeight: 'bold',
          },
        });
        await fetch('/api/birthday/wish', { method: 'POST' });
      }
    }
    checkBirthday();
  }, [session]);

  return null;
}