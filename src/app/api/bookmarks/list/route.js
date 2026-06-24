import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json([]);
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id },
    include: { post: { include: { author: { select: { name: true, image: true } } } } },
  });
  const posts = bookmarks.map(b => b.post);
  return Response.json(posts);
}