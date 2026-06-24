import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    return new Response('Unauthorized', { status: 401 });
  }

  const { name, email, password } = await req.json();

  const data = {};
  if (name) data.name = name;
  if (email) data.email = email;
  if (password && password.length >= 6) {
    data.password = await bcrypt.hash(password, 10);
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data,
    });
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Update failed. Email may already be in use.' }, { status: 400 });
  }
}