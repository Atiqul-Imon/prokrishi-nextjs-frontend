// Form types and Zod schemas

import { z } from 'zod';

// Login Schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Register Schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().optional(),
});

// Address Schema
export const addressSchema = z.object({
  name: z.string().min(1, 'Address label is required').optional(),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^(\+880|880|0)?1[3-9]\d{8}$/, 'Please enter a valid Bangladeshi phone number')
    .optional(),
  division: z.string().min(1, 'Please select a division').optional(),
  district: z.string().min(2, 'District is required'),
  upazila: z.string().min(2, 'Upazila is required'),
  address: z.string().min(10, 'Please provide a detailed address'),
  postalCode: z.string().regex(/^\d{4}$/, 'Please enter a valid 4-digit postal code'),
  isDefault: z.boolean().optional(),
});

// Product Schema (for admin)
export const productSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(0, 'Price must be positive'),
  stock: z.number().min(0, 'Stock must be positive'),
  category: z.string().min(1, 'Category is required'),
  measurement: z.number().min(0.01, 'Measurement must be at least 0.01'),
  unit: z.enum(['pcs', 'kg', 'g', 'l', 'ml'], {
    errorMap: () => ({ message: 'Unit must be one of: pcs, kg, g, l, ml' })
  }),
  minOrderQuantity: z.number().min(0.01, 'Minimum order quantity must be at least 0.01').optional(),
  measurementIncrement: z.number().min(0.01, 'Measurement increment must be at least 0.01').optional(),
  status: z.enum(['active', 'inactive', 'out_of_stock']).optional(),
  image: z.string().optional(),
});

// Category Schema (for admin)
export const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().optional(),
});

// Contact Form Schema
export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Reset Password Schema
export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Profile Update Schema
export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().optional(),
});

// Inferred Types
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type ContactFormData = z.infer<typeof contactSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ProfileUpdateFormData = z.infer<typeof profileUpdateSchema>;

