// Context types

import { User, Product, CartItem } from './models';
import { LoginFormData, RegisterFormData } from './forms';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAdmin: boolean;
  login: (form: LoginFormData) => Promise<{ success: boolean; message?: string }>;
  register: (form: RegisterFormData) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (user: User) => void;
  refreshUser?: () => Promise<void>;
}

export interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (product: Product, qty?: number, variantId?: string) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string) => void;
  removeFromCart: (id: string, variantId?: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  isSidebarOpen: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

