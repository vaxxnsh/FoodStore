import { z } from 'zod';

export const signupSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  phoneNumber: z.string().min(10, { message: 'Phone number should be at least 10 digits.' }).max(10,{ message: 'Phone number should be at most 10 digits.' }),
  address: z.string().optional(),
  password: z.string().min(6, { message: 'Password should be at least 6 characters.' }),
});

export const loginSchema = z.object({
    email: z.string().email({ message: 'Invalid email address.' }),
    password: z.string().min(6, { message: 'Password should be at least 6 characters.' }),
});
