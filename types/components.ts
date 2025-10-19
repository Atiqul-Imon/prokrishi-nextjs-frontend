// Component prop types

import { ReactNode } from 'react';
import { Product, Category, Order, Address } from './models';

export interface ProductCardProps {
  product: Product;
}

export interface EmptyStateProps {
  type?: string;
  title?: string | null;
  description?: string | null;
  actionText?: string | null;
  actionHref?: string | null;
  onAction?: (() => void) | null;
  icon?: any;
  showAction?: boolean;
}

export interface CheckoutProgressProps {
  currentStep: string;
}

export interface CategoryFormProps {
  initial?: Category | null;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}

export interface ProductFormProps {
  initial?: Product | null;
  onSave: (data: any) => Promise<void>;
  loading: boolean;
}

export interface AddressFormProps {
  initial?: Address | null;
  onSave: (data: Address) => Promise<void> | void;
  onClose: () => void;
}

export interface SidebarProps {
  current: string;
}

export interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: any;
  trend?: string;
  trendValue?: string;
}

// Page params types for dynamic routes
export interface PageParams {
  params: {
    id: string;
    token?: string;
  };
}

export interface SearchParams {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

