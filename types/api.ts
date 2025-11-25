// API request/response types

import { User, Product, Category, Order, CartItem, DashboardStats } from './models';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: boolean;
  data?: T;
  redirect?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email?: string; // Email is now OPTIONAL
  phone: string; // Phone is now REQUIRED
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  q?: string;
  sort?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  sortOrder?: string;
  category?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  status?: string;
}

export interface PaginatedResponse<T> {
  data?: T[];
  products?: T[]; // For product listings
  orders?: T[]; // For order listings
  users?: T[]; // For user listings
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    totalProducts?: number;
    totalOrders?: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
}

export interface ProductsResponse extends Omit<PaginatedResponse<Product>, 'categories'> {
  products: Product[];
  filters?: any;
  categories?: Category[];
}

export interface OrdersResponse extends PaginatedResponse<Order> {
  orders: Order[];
}

export interface CategoriesResponse {
  categories: Category[];
  success: boolean;
}

export interface ProductResponse {
  product: Product;
  success: boolean;
}

export interface CategoryResponse {
  category: Category;
  success: boolean;
}

export interface OrderResponse {
  order?: Order;
  data?: Order;
  _id?: string;
  success: boolean;
  message?: string;
}

export interface UserProfileResponse {
  user: User;
  success: boolean;
}

export interface DashboardStatsResponse {
  stats?: DashboardStats;
  success: boolean;
}

export interface PaymentInitResponse {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  message?: string;
}

export interface ShippingQuoteItem {
  product: string;
  quantity: number;
  variantId?: string;
}

export interface ShippingQuoteRequest {
  orderItems: ShippingQuoteItem[];
  shippingAddress: {
    address: string;
    division?: string;
    district?: string;
    upazila?: string;
    postalCode?: string;
  };
  shippingZone?: 'inside_dhaka' | 'outside_dhaka';
}

export interface ShippingQuoteResponse {
  success: boolean;
  shippingFee: number;
  totalWeightKg: number;
  zone: string;
  breakdown?: {
    type: string;
    tier: string;
  };
}

