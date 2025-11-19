// Core domain models for Prokrishi e-commerce platform

export interface User {
  _id: string;
  name: string;
  email?: string; // Email is now OPTIONAL
  phone: string; // Phone is now REQUIRED
  role: 'user' | 'admin' | 'super_admin';
  addresses?: Address[];
  orders?: Order[];
  totalSpent?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  _id: string;
  label: string;
  sku?: string;
  price: number;
  stock: number;
  measurement: number;
  unit: 'pcs' | 'kg' | 'g' | 'l' | 'ml';
  measurementIncrement?: number;
  status?: 'active' | 'inactive' | 'out_of_stock';
  isDefault?: boolean;
  image?: string;
}

export interface Product {
  _id: string;
  id?: string; // For cart compatibility
  name: string;
  description: string;
  shortDescription?: string;
  price: number; // Legacy field, kept for backward compatibility
  image: string;
  category: string | Category;
  stock: number; // Legacy field, kept for backward compatibility
  sku: string;
  measurement: number; // Legacy field, kept for backward compatibility
  unit: string; // Legacy field, kept for backward compatibility
  minOrderQuantity?: number;
  measurementIncrement?: number; // Legacy field, kept for backward compatibility
  displayMeasurement?: string; // Virtual field from backend
  pricePerUnit?: number; // Virtual field from backend
  status: 'active' | 'inactive' | 'out_of_stock';
  // Variant support
  hasVariants?: boolean;
  variants?: ProductVariant[];
  defaultVariantId?: string;
  variantSummary?: {
    minPrice: number;
    maxPrice: number;
    totalStock: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  id?: string; // Alternative ID field
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  status?: string; // Alternative status field
  totalPrice: number;
  total?: number; // Alternative total field
  transactionId?: string;
  createdAt: string;
  date?: string; // Alternative date field
  updatedAt: string;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  variantId?: string;
  variantSnapshot?: ProductVariant;
}

export interface Address {
  _id?: string;
  name?: string; // Address label
  phone?: string;
  division?: string;
  district: string;
  upazila: string;
  address: string;
  postalCode: string;
  isDefault?: boolean;
  addressType?: string;
}

export interface CartItem extends Product {
  quantity: number;
  variantId?: string;
  variantSnapshot?: ProductVariant;
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders?: Order[];
  topProducts?: Product[];
}

