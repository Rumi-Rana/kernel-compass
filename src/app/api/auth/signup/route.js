import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  const { name, email, password } = await req.json();
  if (!name || !email || !password) return Response.json({ error: 'Missing fields' }, { status: 400 });
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return Response.json({ error: 'Email already used' }, { status: 400 });
  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email, password: hashed },
  });
  return Response.json({ success: true });
}