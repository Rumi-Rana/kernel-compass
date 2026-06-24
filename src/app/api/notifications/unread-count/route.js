import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ count: 0 });
  const count = await prisma.notification.count({
    where: { userId: session.user.id, read: false },
  });
  return Response.json({ count });
}