import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getRandomBirthdayMessage } from '@/lib/birthdayMessages';

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const message = getRandomBirthdayMessage();
  await prisma.notification.create({
    data: { type: 'BIRTHDAY', message, userId: session.user.id },
  });
  return Response.json({ success: true });
}