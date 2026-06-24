import prisma from '@/lib/prisma';
import Link from 'next/link';

export default async function DashboardPosts() {
  const posts = await prisma.post.findMany({
    include: { author: { select: { id: true, name: true, image: true } } },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div className="space-y-6 animate-dramatic">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
          Posts
        </h1>
        <Link href="/dashboard/posts/new" className="btn-bubbly self-start">
          ✨ New Post
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-pink-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md shadow-lg">
        <table className="w-full text-left text-sm">
          <thead className="bg-pink-50 dark:bg-pink-900/20 text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Author</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-100 dark:divide-gray-700">
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 dark:text-gray-400">
                  📝 No posts yet. Click “New Post” to create one!
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="hover:bg-pink-50/50 dark:hover:bg-gray-700/50 transition">
                  <td className="p-4 font-medium text-gray-900 dark:text-white max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800">
                      {post.type}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 dark:text-gray-400">
                    {post.author.name}
                  </td>
                  <td className="p-4">
                    {post.published ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}