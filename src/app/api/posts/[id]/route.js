import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { postSchema } from '@/lib/validations';

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return new Response('Unauthorized', { status: 401 });
  const body = await req.json();
  const validation = postSchema.safeParse(body);
  if (!validation.success) return Response.json({ error: validation.error.errors }, { status: 400 });
  await prisma.post.update({ where: { id: params.id }, data: validation.data });
  return Response.json({ success: true });
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return new Response('Unauthorized', { status: 401 });
  await prisma.post.delete({ where: { id: params.id } });
  return Response.json({ success: true });
}