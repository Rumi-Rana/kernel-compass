import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  const commentId = params.id;

  const existing = await prisma.like.findUnique({
    where: { userId_commentId: { userId: session.user.id, commentId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { userId: session.user.id, commentId },
    });
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true, post: { select: { slug: true } } },
    });
    if (comment && comment.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: 'LIKE',
          message: `${session.user.name} liked your comment`,
          userId: comment.userId,
          triggerId: session.user.id,
          commentId,
          postSlug: comment.post.slug,
        },
      });
    }
  }

  const likesCount = await prisma.like.count({ where: { commentId } });
  return Response.json({ liked: !existing, likesCount });
}