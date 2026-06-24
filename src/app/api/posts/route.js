import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { postSchema } from '@/lib/validations';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get('tag');
  const type = searchParams.get('type') || 'BLOG';
  let where = { published: true, type };
  if (tag) where.tags = { contains: tag };
  const posts = await prisma.post.findMany({
    where,
    include: { author: { select: { name: true, image: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return Response.json(posts);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const validation = postSchema.safeParse(body);
  if (!validation.success) return Response.json({ error: validation.error.errors }, { status: 400 });

  const post = await prisma.post.create({
    data: { ...validation.data, authorId: session.user.id },
  });
  return Response.json(post);
}