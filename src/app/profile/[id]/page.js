import prisma from '@/lib/prisma';
import PostCard from '@/components/blog/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import FollowButton from '@/components/profile/FollowButton';

export default async function UserProfilePage({ params }) {
  const session = await getServerSession(authOptions);
  const userId = params.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      image: true,
      bio: true,
      createdAt: true,
      _count: { select: { followers: true, following: true } },
      posts: {
        where: {
          published: true,
          OR: [
            { visibility: 'PUBLIC' },
            ...(session?.user?.id === userId ? [{ visibility: 'FOLLOWERS' }] : []),
            ...(session?.user?.id && session.user.id !== userId
              ? [{ visibility: 'FOLLOWERS', author: { followers: { some: { followerId: session.user.id } } } }]
              : []),
          ],
        },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          coverImage: true,
          type: true,
          visibility: true,
          createdAt: true,
          author: { select: { id: true, name: true, image: true } },
        },
      },
      comments: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          text: true,
          createdAt: true,
          post: { select: { slug: true, title: true } },
        },
        take: 20,
      },
    },
  });

  if (!user) notFound();

  let isFollowing = false;
  if (session?.user?.id && session.user.id !== userId) {
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    });
    isFollowing = !!follow;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 relative z-10 animate-dramatic">
      {/* Profile header card */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl p-6 border border-pink-200 dark:border-gray-700 shadow-lg mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <img
            src={user.image || '/avatar-placeholder.png'}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-2 border-pink-300 dark:border-pink-600"
          />
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.name}</h1>
            {user.bio && (
              <p className="mt-1 text-gray-600 dark:text-gray-300">{user.bio}</p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Joined {new Date(user.createdAt).toLocaleDateString()}
            </p>

            {/* Follower counts */}
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-600 dark:text-gray-400">
              <span><strong>{user._count.followers}</strong> followers</span>
              <span><strong>{user._count.following}</strong> following</span>
            </div>
          </div>

          {/* Follow Button */}
          <FollowButton userId={user.id} initialFollowing={isFollowing} />
        </div>
      </div>

      {/* Two columns: posts and comments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Posts by {user.name}</h2>
          {user.posts.length > 0 ? (
            <div className="space-y-4">
              {user.posts.map(post => (
                <div key={post.id}>
                  {post.visibility === 'FOLLOWERS' && (
                    <span className="text-xs bg-pink-100 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full mb-1 inline-block">
                      🔒 Followers only
                    </span>
                  )}
                  <PostCard post={post} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No posts yet.</p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Comments</h2>
          {user.comments.length > 0 ? (
            <div className="space-y-3">
              {user.comments.map(comment => (
                <div
                  key={comment.id}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-3 border border-pink-100 dark:border-gray-700 text-sm"
                >
                  <Link
                    href={`/post/${comment.post.slug}`}
                    className="text-pink-600 dark:text-pink-400 hover:underline font-medium"
                  >
                    on {comment.post.title}
                  </Link>
                  <div
                    dangerouslySetInnerHTML={{ __html: comment.text }}
                    className="mt-1 text-gray-700 dark:text-gray-300 line-clamp-2"
                  />
                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}