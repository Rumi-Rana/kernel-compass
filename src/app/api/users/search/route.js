import prisma from '@/lib/prisma';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const users = await prisma.user.findMany({
    where: { name: { contains: q, mode: 'insensitive' } },
    select: { id: true, name: true, image: true },
    take: 10,
  });
  return Response.json(users);
}