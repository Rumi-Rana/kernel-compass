import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req, { params }) {
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
            // if the viewer is the owner, also show FOLLOWERS posts
            ...(session?.user?.id === userId ? [{ visibility: 'FOLLOWERS' }] : []),
            // if the viewer is a follower, also show FOLLOWERS posts
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

  if (!user) return new Response('Not found', { status: 404 });

  // Check if current user is following this profile
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

  return Response.json({
    ...user,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    isFollowing,
  });
}