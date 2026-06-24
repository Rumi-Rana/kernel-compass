import prisma from '@/lib/prisma';
import PostCard from '@/components/blog/PostCard';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
      <h1 className="text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-10 animate-dramatic">
        All Articles
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <div key={post.id} className={`animate-dramatic delay-${Math.min(i * 100, 500)}`}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
    </div>
  );
}