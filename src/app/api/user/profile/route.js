import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { profileSchema } from '@/lib/validations';

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const validation = profileSchema.safeParse(body);
  if (!validation.success) return Response.json({ error: validation.error.errors }, { status: 400 });

  const { name, bio, image } = validation.data;
  const birthday = body.birthday; // not in profileSchema, but we'll allow it

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name, bio, image, birthday },
  });

  return Response.json({ success: true });
}