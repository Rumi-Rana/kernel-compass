import { z } from 'zod';

export const commentSchema = z.object({
  text: z.string().min(1).max(5000),
  postId: z.string(),
  parentId: z.string().nullable().optional(),
});

export const postSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200).regex(/^[a-z0-9-]+$/),
  excerpt: z.string().max(500).optional(),
  content: z.string(),
  coverImage: z.string().url().optional().or(z.literal('')),
  published: z.boolean().optional(),
  type: z.enum(['BLOG', 'VENT', 'MOTIVATION', 'EXPERIENCE']).default('BLOG'),
  mood: z.string().optional().nullable(),
  tags: z.string().optional(),
});

export const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

export const profileSchema = z.object({
  name: z.string().min(2).max(100),
  bio: z.string().max(500).optional(),
  image: z.string().url().optional().or(z.literal('')),
});