'use client';
import { useRouter } from 'next/navigation';

export default function DeleteCommentButton({ id }) {
  const router = useRouter();
  const handleDelete = async () => {
    await fetch(`/api/dashboard/comments/${id}`, { method: 'DELETE' });
    router.refresh();
  };
  return <button onClick={handleDelete} className="text-red-500 text-sm">Delete</button>;
}