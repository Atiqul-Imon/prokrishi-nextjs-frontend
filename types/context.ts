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
  addToCart: (product: Product, qty?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

