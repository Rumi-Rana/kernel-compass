import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { commentSchema } from '@/lib/validations';
import { sanitize } from 'isomorphic-dompurify';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit(5, 60000);

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });
  const { limited } = limiter(req);
  if (limited) return Response.json({ error: 'Too many requests' }, { status: 429 });

  const body = await req.json();
  const validation = commentSchema.safeParse(body);
  if (!validation.success) return Response.json({ error: validation.error.errors }, { status: 400 });

  let { text, postId, parentId } = validation.data;
  text = sanitize(text);

  const mentionRegex = /@(\w+)/g;
  const mentionedUsernames = [...text.matchAll(mentionRegex)].map(m => m[1]);

  const mentionedUsers = await prisma.user.findMany({
    where: { name: { in: mentionedUsernames } },
    select: { id: true, name: true },
  });

  const comment = await prisma.comment.create({
    data: { text, userId: session.user.id, postId, parentId: parentId || null },
  });

  for (const user of mentionedUsers) {
    if (user.id !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: 'MENTION',
          message: `${session.user.name} mentioned you in a comment`,
          userId: user.id,
          triggerId: session.user.id,
          commentId: comment.id,
          postSlug: (await prisma.post.findUnique({ where: { id: postId }, select: { slug: true } })).slug,
        },
      });
    }
  }

  if (parentId) {
    const parentComment = await prisma.comment.findUnique({ where: { id: parentId }, select: { userId: true } });
    if (parentComment && parentComment.userId !== session.user.id) {
      await prisma.notification.create({
        data: {
          type: 'REPLY',
          message: `${session.user.name} replied to your comment`,
          userId: parentComment.userId,
          triggerId: session.user.id,
          commentId: comment.id,
          postSlug: (await prisma.post.findUnique({ where: { id: postId }, select: { slug: true } })).slug,
        },
      });
    }
  }

  return Response.json(comment);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const postId = searchParams.get('postId');
  if (!postId) return Response.json([]);
  const comments = await prisma.comment.findMany({
    where: { postId, parentId: null },
    include: {
      user: { select: { id: true, name: true, image: true } },
      likes: true,
      _count: { select: { likes: true } },
      replies: {
        include: {
          user: { select: { id: true, name: true, image: true } },
          likes: true,
          _count: { select: { likes: true } },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(comments);
}