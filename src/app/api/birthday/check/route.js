import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getRandomBirthdayMessage } from '@/lib/birthdayMessages';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return Response.json({ isBirthday: false });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { birthday: true },
  });
  if (!user?.birthday) return Response.json({ isBirthday: false });

  const today = new Date();
  const todayMonthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  if (user.birthday !== todayMonthDay) return Response.json({ isBirthday: false });

  const thisYear = today.getFullYear();
  const existingWish = await prisma.notification.findFirst({
    where: {
      userId: session.user.id,
      type: 'BIRTHDAY',
      createdAt: { gte: new Date(`${thisYear}-01-01`) },
    },
  });
  if (existingWish) return Response.json({ isBirthday: true, alreadyWished: true });

  const message = getRandomBirthdayMessage();
  return Response.json({ isBirthday: true, alreadyWished: false, message });
}