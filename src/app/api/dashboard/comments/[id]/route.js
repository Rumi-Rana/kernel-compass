import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') return new Response('Unauthorized', { status: 401 });
  await prisma.comment.delete({ where: { id: params.id } });
  return Response.json({ success: true });
}