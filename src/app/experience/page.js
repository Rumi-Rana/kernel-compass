import prisma from '@/lib/prisma';
import PostCard from '@/components/blog/PostCard';
import Link from 'next/link';

export default async function ExperiencePage() {
  const posts = await prisma.post.findMany({
    where: { published: true, type: 'EXPERIENCE' },
    include: { author: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative z-10">
      <div className="text-center mb-10 animate-dramatic">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-400 dark:to-cyan-300">
          🌍 Share Your Experience
        </h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">Tips, stories, and wisdom from life abroad.</p>
        <Link href="/create?type=EXPERIENCE" className="mt-6 inline-block btn-bubbly text-lg px-8 py-3" style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
          Write your story
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <div key={post.id} className={`animate-dramatic delay-${Math.min(i * 100, 500)}`}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
      {posts.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 animate-dramatic">No experiences shared yet — be the pioneer!</p>}
    </div>
  );
}