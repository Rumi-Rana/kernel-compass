import { contactSchema } from '@/lib/validations';
import prisma from '@/lib/prisma';
import rateLimit from '@/lib/rateLimit';

const limiter = rateLimit(2, 60000);

export async function POST(req) {
  const { limited } = limiter(req);
  if (limited) return Response.json({ error: 'Too many messages' }, { status: 429 });
  const body = await req.json();
  const validation = contactSchema.safeParse(body);
  if (!validation.success) return Response.json({ error: validation.error.errors }, { status: 400 });
  await prisma.contactMessage.create({ data: validation.data });
  return Response.json({ success: true });
}