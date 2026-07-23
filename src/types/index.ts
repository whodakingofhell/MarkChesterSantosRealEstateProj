// Core types for the application

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'ADMIN' | 'BROKER' | 'APPRAISER' | 'CLIENT';

export interface BrokerProfile {
  id: string;
  userId: string;
  user: User;
  licenseNumber: string;
  licenseExpiry: Date;
  specializations: string[];
  yearsExperience: number;
  bio?: string;
  photo?: string;
  socialMedia?: SocialMedia;
  contactInfo?: ContactInfo;
  slug: string;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppraiserProfile {
  id: string;
  userId: string;
  user: User;
  licenseNumber: string;
  licenseExpiry: Date;
  specializations: string[];
  yearsExperience: number;
  bio?: string;
  photo?: string;
  socialMedia?: SocialMedia;
  contactInfo?: ContactInfo;
  slug: string;
  isVerified: boolean;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientProfile {
  id: string;
  userId: string;
  user: User;
  phone?: string;
  address?: string;
  preferences?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
}

export interface ContactInfo {
  phone?: string;
  whatsapp?: string;
  viber?: string;
  email?: string;
  website?: string;
}

export interface Property {
  id: string;
  brokerId: string;
  broker: BrokerProfile;
  title: string;
  description: string;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  lotArea?: number;
  floorArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  carGarage?: number;
  address: string;
  city: string;
  province: string;
  latitude?: number;
  longitude?: number;
  features: string[];
  images: string[];
  documents: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyType = 'LOT_ONLY' | 'HOUSE_AND_LOT' | 'FARM_LOT' | 'COMMERCIAL' | 'BEACHFRONT' | 'CONDOMINIUM' | 'TOWNHOUSE' | 'MIXED_USE' | 'INDUSTRIAL' | 'LAND' | 'RESIDENTIAL' | 'CONDO' | 'APARTMENT';
export type PropertyStatus = 'ACTIVE' | 'SOLD' | 'PENDING' | 'WITHDRAWN';

export interface Transaction {
  id: string;
  propertyId: string;
  property: Property;
  brokerId: string;
  broker: BrokerProfile;
  clientId: string;
  client: ClientProfile;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  commission: number;
  commissionRate: number;
  documents: string[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type TransactionType = 'SALE' | 'LEASE' | 'RENTAL';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';

export interface Appraisal {
  id: string;
  propertyId: string;
  property: Property;
  appraiserId: string;
  appraiser: AppraiserProfile;
  status: AppraisalStatus;
  report?: Record<string, unknown>;
  value?: number;
  documents: string[];
  notes?: string;
  scheduledDate?: Date;
  completedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type AppraisalStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'REVIEWED' | 'APPROVED';

export interface Review {
  id: string;
  brokerId?: string;
  broker?: BrokerProfile;
  appraiserId?: string;
  appraiser?: AppraiserProfile;
  clientName: string;
  clientEmail: string;
  rating: number;
  comment?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactSubmission {
  id: string;
  professionalId: string;
  professionalType: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  subject: string;
  message: string;
  propertyType?: string;
  budgetRange?: string;
  source: string;
  forwardingStatus?: ForwardingStatus;
  createdAt: Date;
}

export interface ForwardingStatus {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface SearchFilters {
  query?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  province?: string;
  bedrooms?: number;
  bathrooms?: number;
  page: number;
  limit: number;
}

export interface SearchResults {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
