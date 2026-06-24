import prisma from '@/lib/prisma';
import DeleteCommentButton from '@/components/dashboard/DeleteCommentButton';

export default async function DashboardComments() {
  const comments = await prisma.comment.findMany({
    include: {
      user: true,
      post: { select: { title: true, slug: true } },
    },
  });

  return (
    <div className="space-y-6 animate-dramatic">
      <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
        Comments
      </h1>
      <div className="space-y-3">
        {comments.map(c => (
          <div
            key={c.id}
            className="p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border border-pink-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {c.user?.name} <span className="text-xs text-gray-500 dark:text-gray-400">on {c.post?.title}</span>
              </p>
              <div
                className="text-sm text-gray-700 dark:text-gray-300 mt-1"
                dangerouslySetInnerHTML={{ __html: c.text }}
              />
            </div>
            <DeleteCommentButton id={c.id} />
          </div>
        ))}
      </div>
    </div>
  );
}