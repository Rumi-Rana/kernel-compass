import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const { followingId } = await req.json();
  if (!followingId || followingId === session.user.id) {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }

  // Check if already following
  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: session.user.id,
        followingId,
      },
    },
  });

  if (existing) {
    // Unfollow
    await prisma.follow.delete({ where: { id: existing.id } });
    return Response.json({ following: false });
  } else {
    // Follow
    await prisma.follow.create({
      data: { followerId: session.user.id, followingId },
    });
    return Response.json({ following: true });
  }
}