import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string()
    .min(8)
    .refine((password) => Buffer.byteLength(password, 'utf8') <= 72, {
      message: 'Password must be no more than 72 UTF-8 bytes.',
    }),
}).strict();

export const loginSchema = z.object({
  email: z.string().trim().email().max(254).transform((email) => email.toLowerCase()),
  password: z.string().min(1),
}).strict();
