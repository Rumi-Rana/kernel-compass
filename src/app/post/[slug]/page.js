import prisma from '@/lib/prisma';
import CommentSection from '@/components/blog/CommentSection';
import { notFound } from 'next/navigation';
import { sanitize } from 'isomorphic-dompurify';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import SaveButton from './SaveButton';
import ReadingProgress from '@/components/blog/ReadingProgress';

export default async function PostPage({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });
  if (!post || !post.published) notFound();

  const session = await getServerSession(authOptions);
  let isSaved = false;

  if (session?.user?.id) {
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: session.user.id,
          postId: post.id,
        },
      },
    });
    isSaved = !!bookmark;
  }

  const sanitizedContent = sanitize(post.content);

  return (
    <article className="max-w-4xl mx-auto px-4 py-10 relative z-10 animate-dramatic">
      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded-2xl mb-6 shadow-lg"
        />
      )}

      {/* Title & Save button row */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 dark:from-pink-400 dark:to-purple-400">
          {post.title}
        </h1>
        {session && (
          <SaveButton postId={post.id} initialSaved={isSaved} />
        )}
      </div>

      {/* Author & date */}
      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-8">
        <img
          src={post.author.image || '/avatar-placeholder.png'}
          className="w-8 h-8 rounded-full"
        />
        <a href={`/profile/${post.author.id}`} className="hover:text-pink-600 dark:hover:text-pink-400 transition font-medium">
          {post.author.name}
        </a>
        <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Article content */}
      <div
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
        className="
          prose dark:prose-invert max-w-none
          prose-headings:font-bold prose-headings:text-transparent prose-headings:bg-clip-text prose-headings:bg-gradient-to-r prose-headings:from-pink-500 prose-headings:to-purple-600
          prose-a:text-pink-600 dark:prose-a:text-pink-400 prose-a:underline prose-a:target:_blank
          prose-img:rounded-2xl prose-img:shadow-lg
          prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300
          break-words
        "
      />

      {/* Hidden AdSense placeholder – invisible until you add real ad code */}
      <div id="adsense-unit" className="my-8" style={{ display: 'none' }} />

      <CommentSection postId={post.id} slug={post.slug} />
      <ReadingProgress slug={params.slug} />
    </article>
  );
}