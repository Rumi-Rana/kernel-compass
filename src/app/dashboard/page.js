import prisma from '@/lib/prisma';

export default async function DashboardOverview() {
  const postsCount = await prisma.post.count();
  const commentsCount = await prisma.comment.count();
  const messagesCount = await prisma.contactMessage.count({ where: { read: false } });

  return (
    <div className="space-y-6 animate-dramatic">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Dashboard Overview
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-pink-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Posts</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{postsCount}</p>
        </div>
        <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-pink-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Comments</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{commentsCount}</p>
        </div>
        <div className="p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-lg border border-pink-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Unread Messages</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{messagesCount}</p>
        </div>
      </div>
    </div>
  );
}