import { z } from 'zod';

// Common validation patterns
const phoneRegex = /^\+?[\d\s-()]+$/;
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// User registration schema
export const registerSchema = z.object({
  email: z.string().email('Invalid email address').max(254),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  name: z.string().min(1, 'Name is required').max(100),
  role: z.enum(['BROKER', 'APPRAISER', 'CLIENT']),
});

// User login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Broker profile schema
export const brokerProfileSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required').max(50),
  licenseExpiry: z.string().datetime(),
  specializations: z.array(z.string()).min(1, 'At least one specialization required'),
  yearsExperience: z.number().int().min(0).max(100),
  bio: z.string().max(2000).optional(),
  photo: z.string().url().optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }).optional(),
  contactInfo: z.object({
    phone: z.string().regex(phoneRegex).optional(),
    whatsapp: z.string().regex(phoneRegex).optional(),
    viber: z.string().regex(phoneRegex).optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
  }).optional(),
  slug: z.string().regex(slugRegex, 'Invalid slug format').max(100),
});

// Appraiser profile schema
export const appraiserProfileSchema = z.object({
  licenseNumber: z.string().min(1, 'License number is required').max(50),
  licenseExpiry: z.string().datetime(),
  specializations: z.array(z.string()).min(1, 'At least one specialization required'),
  yearsExperience: z.number().int().min(0).max(100),
  bio: z.string().max(2000).optional(),
  photo: z.string().url().optional(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    instagram: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }).optional(),
  contactInfo: z.object({
    phone: z.string().regex(phoneRegex).optional(),
    whatsapp: z.string().regex(phoneRegex).optional(),
    viber: z.string().regex(phoneRegex).optional(),
    email: z.string().email().optional(),
    website: z.string().url().optional(),
  }).optional(),
  slug: z.string().regex(slugRegex, 'Invalid slug format').max(100),
});

// Property schema
export const propertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  propertyType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'MIXED_USE']),
  price: z.number().positive('Price must be positive').max(999999999999),
  lotArea: z.number().positive().optional(),
  floorArea: z.number().positive().optional(),
  bedrooms: z.number().int().min(0).max(100).optional(),
  bathrooms: z.number().int().min(0).max(100).optional(),
  carGarage: z.number().int().min(0).max(100).optional(),
  address: z.string().min(1, 'Address is required').max(500),
  city: z.string().min(1, 'City is required').max(100),
  province: z.string().min(1, 'Province is required').max(100),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url()).max(20).optional(),
});

// Contact submission schema
export const contactSubmissionSchema = z.object({
  professionalId: z.string().min(1),
  professionalType: z.enum(['broker', 'appraiser']),
  clientName: z.string().min(1, 'Name is required').max(100),
  clientEmail: z.string().email('Invalid email address').max(254),
  clientPhone: z.string().regex(phoneRegex).optional(),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  propertyType: z.string().max(50).optional(),
  budgetRange: z.string().max(50).optional(),
  turnstileToken: z.string().max(4096).optional(),
  hmacSignature: z.string().max(512).optional(),
  clientTimestamp: z.number().positive(),
});

// Transaction schema
export const transactionSchema = z.object({
  propertyId: z.string().min(1),
  clientId: z.string().min(1),
  type: z.enum(['SALE', 'LEASE', 'RENTAL']),
  amount: z.number().positive('Amount must be positive'),
  commissionRate: z.number().min(0).max(100),
  notes: z.string().max(2000).optional(),
});

// Appraisal schema
export const appraisalSchema = z.object({
  propertyId: z.string().min(1),
  scheduledDate: z.string().datetime().optional(),
  notes: z.string().max(2000).optional(),
});

// Review schema
export const reviewSchema = z.object({
  professionalId: z.string().min(1),
  professionalType: z.enum(['broker', 'appraiser']),
  clientName: z.string().min(1, 'Name is required').max(100),
  clientEmail: z.string().email('Invalid email address').max(254),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5'),
  comment: z.string().max(2000).optional(),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().max(200).optional(),
  propertyType: z.enum(['RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'LAND', 'MIXED_USE']).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  city: z.string().max(100).optional(),
  province: z.string().max(100).optional(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Type exports
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type BrokerProfileInput = z.infer<typeof brokerProfileSchema>;
export type AppraiserProfileInput = z.infer<typeof appraiserProfileSchema>;
export type PropertyInput = z.infer<typeof propertySchema>;
export type ContactSubmissionInput = z.infer<typeof contactSubmissionSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type AppraisalInput = z.infer<typeof appraisalSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
