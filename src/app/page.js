import prisma from '@/lib/prisma';
import PostCard from '@/components/blog/PostCard';
import Link from 'next/link';

export default async function Home() {
  const posts = await prisma.post.findMany({
    where: { published: true, type: 'BLOG' },
    include: { author: { select: { id: true, name: true, image: true } } },
    orderBy: { createdAt: 'desc' },
    take: 6,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-400 animate-float">
          Kernel Compass
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-200">
          Navigate your journey abroad with stories, motivation, venting, and a community that understands.
        </p>
        <div className="mt-8 flex justify-center gap-4 animate-fade-in-up delay-300">
          <Link href="/create" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition shadow-lg animate-pulse-glow">
            Share your story
          </Link>
          <Link href="/vent" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            Visit Vent Corner
          </Link>
        </div>
      </div>

      {/* Latest Articles */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 animate-fade-in-up">Latest Articles</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <div key={post.id} className={`animate-fade-in-up delay-${Math.min(index * 100, 500)}`}>
            <PostCard post={post} />
          </div>
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-center text-gray-500 dark:text-gray-400 animate-fade-in-up">No articles yet — be the first!</p>
      )}
      <div className="mt-12 text-center animate-fade-in-up delay-500">
        <Link href="/posts" className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-400 hover:underline font-bold text-lg">
          View all articles →
        </Link>
      </div>
    </div>
  );
}