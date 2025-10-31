// app/utils/api.ts
// Centralized API utility for Prokrishi frontend (Next.js) using axios and localStorage-based JWT

import axios from "axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ApiResponse,
  UserProfileResponse,
  ProductsResponse,
  ProductResponse,
  CategoryResponse,
  OrderResponse,
  DashboardStatsResponse,
  PaymentInitResponse,
  PaginationParams,
} from "@/types/api";
import { Address, Product, Category, Order } from "@/types/models";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3500/api";

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 20000, // 20 second timeout for better reliability
});

// Request interceptor: Attach JWT (if any) from localStorage
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: Handle 401/403, auto-logout (optional), extract tokens, etc.
api.interceptors.response.use(
  (response) => response,
  (error: any) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Optionally redirect to login page
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Universal axios wrapper for API requests.
 */
export async function apiRequest<T = any>(
  path: string,
  options: any = {}
): Promise<T> {
  try {
    const res = await api({
      url: path,
      ...options,
    });
    return res.data as T;
  } catch (err: any) {
    let msg = err.response?.data?.message || err.message || "API Error";
    
    // Handle timeout errors specifically
    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      msg = "Request timeout - please try again";
    }
    
    // Handle network errors
    if (err.code === 'ERR_NETWORK' || !err.response) {
      msg = "Network error - please check your connection";
    }
    
    // Handle 404 errors specifically
    if (err.response?.status === 404) {
      msg = "Product not found - it may have been deleted";
    }
    
    throw new Error(msg);
  }
}

/**
 * Register a new user.
 */
export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const response = await apiRequest<RegisterResponse>("/user/register", {
    method: "POST",
    data,
  });
  if (response.accessToken) {
    localStorage.setItem("accessToken", response.accessToken);
  }
  if (response.refreshToken) {
    localStorage.setItem("refreshToken", response.refreshToken);
  }
  return response;
}

/**
 * Login user.
 */
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiRequest<LoginResponse>("/user/login", {
    method: "POST",
    data,
  });
  if (response.accessToken) {
    localStorage.setItem("accessToken", response.accessToken);
  }
  if (response.refreshToken) {
    localStorage.setItem("refreshToken", response.refreshToken);
  }
  return response;
}

/**
 * Logout user.
 */
export function logoutUser(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

/**
 * Fetch current user profile (requires valid JWT).
 */
export function fetchProfile(): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>("/user/profile", {
    method: "GET",
  });
}

export async function updateUserAddresses(addresses: Address[]): Promise<UserProfileResponse> {
  console.log("API: updateUserAddresses called with:", addresses);
  try {
    const result = await apiRequest<UserProfileResponse>("/user/profile", {
      method: "PUT",
      data: { addresses },
    });
    console.log("API: updateUserAddresses successful response:", result);
    return result;
  } catch (error) {
    console.error("API: updateUserAddresses error:", error);
    throw error;
  }
}

export async function placeOrder(orderData: any): Promise<OrderResponse> {
  return apiRequest<OrderResponse>("/order/create", {
    method: "POST",
    data: orderData,
  });
}

// Generic GET list
export function getResourceList<T = any>(resource: string, query = ""): Promise<T> {
  const path = `/${resource}${query ? `?${query}` : ""}`;
  return apiRequest<T>(path, { method: "GET" });
}

// Generic POST (for JSON data)
export function createResource<T = any>(resource: string, payload: any): Promise<T> {
  return apiRequest<T>(`/${resource}`, {
    method: "POST",
    data: payload,
  });
}

// Generic PUT (for JSON data)
export function updateResource<T = any>(resource: string, id: string, payload: any): Promise<T> {
  return apiRequest<T>(`/${resource}/${id}`, {
    method: "PUT",
    data: payload,
  });
}

// Generic DELETE
export function deleteResource<T = any>(resource: string, id: string): Promise<T> {
  return apiRequest<T>(`/${resource}/${id}`, {
    method: "DELETE",
  });
}

export function getUserById(id: string): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>(`/user/${id}`);
}

export function getProductById(id: string): Promise<ProductResponse> {
  // Add cache busting parameter to ensure fresh data
  const timestamp = Date.now();
  return apiRequest<ProductResponse>(`/product/${id}?t=${timestamp}`);
}

/**
 * Get related products for a product
 */
export async function getRelatedProducts(productId: string, limit: number = 6): Promise<{ success: boolean; products: Product[] }> {
  return apiRequest<{ success: boolean; products: Product[] }>(`/product/${productId}/related?limit=${limit}`);
}

export async function getCategoryById(id: string): Promise<CategoryResponse> {
  return apiRequest<CategoryResponse>(`/category/id/${id}`);
}

// ========== PRODUCT-SPECIFIC (for file/image upload) ==========

/**
 * Create product (with file/image upload).
 */
export async function createProduct(productData: any): Promise<ProductResponse> {
  const formData = new FormData();
  for (const key in productData) {
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  }

  try {
    const res = await api.post<ProductResponse>("/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err: any) {
    const msg =
      err.response?.data?.message || err.message || "Failed to create product";
    throw new Error(msg);
  }
}

/**
 * Update product (with file/image upload).
 */
export async function updateProduct(id: string, productData: any): Promise<ProductResponse> {
  const formData = new FormData();
  for (const key in productData) {
    if (key === "image" && !(productData[key] instanceof File)) {
      continue;
    }
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  }

  try {
    const res = await api.put<ProductResponse>(`/product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err: any) {
    const msg =
      err.response?.data?.message || err.message || "Failed to update product";
    throw new Error(msg);
  }
}

/**
 * Get all products.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    // Add cache busting parameter to ensure fresh data
    const timestamp = Date.now();
    const res = await api.get<ProductsResponse>(`/product?t=${timestamp}`);
    return res.data.products;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to get products",
    );
  }
}

/**
 * Search products with filters and pagination.
 */
export async function searchProducts(params: PaginationParams = {}): Promise<ProductsResponse> {
  try {
    const queryParams = new URLSearchParams();

    Object.keys(params).forEach((key) => {
      const value = params[key as keyof PaginationParams];
      if (value !== undefined && value !== "") {
        queryParams.append(key, String(value));
      }
    });

    const res = await api.get<ProductsResponse>(`/product/search?${queryParams.toString()}`);
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to search products",
    );
  }
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id: string): Promise<ApiResponse> {
  return deleteResource<ApiResponse>("product", id);
}

/**
 * Toggle featured status of a product.
 */
export async function toggleProductFeatured(productId: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/product/${productId}/toggle-featured`, {
    method: "PATCH",
  });
}

// ========== CATEGORY-SPECIFIC (for file/image upload) ==========

export async function createCategory(category: any): Promise<CategoryResponse> {
  const formData = new FormData();
  formData.append("name", category.name);
  if (category.description) {
    formData.append("description", category.description);
  }
  if (category.image && category.image instanceof File) {
    formData.append("image", category.image);
  }

  try {
    const res = await api.post<CategoryResponse>("/category/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: any) {
    const msg =
      err.response?.data?.message || err.message || "Failed to create category";
    throw new Error(msg);
  }
}

export async function updateCategory(id: string, category: any): Promise<CategoryResponse> {
  // Check if we're doing a simple update (no file upload)
  const hasFile = category.image && category.image instanceof File;
  const hasOnlySimpleFields = !hasFile && Object.keys(category).every(key => 
    typeof category[key] !== 'object' || category[key] === null
  );

  if (hasOnlySimpleFields) {
    // Use JSON for simple updates (like featured toggle) - use PATCH
    try {
      const res = await api.patch<CategoryResponse>(`/category/update/${id}`, category, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Failed to update category";
      throw new Error(msg);
    }
  } else {
    // Use FormData for updates with file uploads
    const formData = new FormData();

    Object.keys(category).forEach((key) => {
      if (key !== "image") {
        formData.append(key, category[key]);
      }
    });

    if (category.image && category.image instanceof File) {
      formData.append("image", category.image);
    }

    try {
      const res = await api.put<CategoryResponse>(`/category/update/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || "Failed to update category";
      throw new Error(msg);
    }
  }
}

export async function deleteCategory(id: string): Promise<ApiResponse> {
  return deleteResource<ApiResponse>("category/delete", id);
}

export async function getFeaturedCategories(): Promise<any> {
  // Add cache-busting timestamp to ensure fresh data
  const timestamp = Date.now();
  return apiRequest(`/category/featured?t=${timestamp}`);
}

// Address Management
export async function addAddress(addressData: Address): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>("/user/profile/addresses", {
    method: "POST",
    data: addressData,
  });
}

// ========== ADMIN ORDER MANAGEMENT ==========

export interface AdminOrderFilters {
  page?: number;
  limit?: number;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AdminOrderStats {
  totalOrders: number;
  totalRevenue: number;
  periodRevenue: number;
  statusBreakdown: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  recentOrders: any[];
  dailySales: any[];
}

export interface AdminOrderResponse {
  success: boolean;
  orders: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalOrders: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    limit: number;
  };
}

export interface AdminOrderStatsResponse {
  success: boolean;
  stats: AdminOrderStats;
}

/**
 * Get all orders with pagination and filtering (Admin)
 */
export async function getAdminOrders(filters: AdminOrderFilters = {}): Promise<AdminOrderResponse> {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.append(key, value.toString());
    }
  });

  const queryString = params.toString();
  const url = `/admin/orders${queryString ? `?${queryString}` : ''}`;
  
  return apiRequest<AdminOrderResponse>(url);
}

/**
 * Get order statistics (Admin)
 */
export async function getAdminOrderStats(period: number = 30): Promise<AdminOrderStatsResponse> {
  return apiRequest<AdminOrderStatsResponse>(`/admin/orders/stats?period=${period}`);
}

/**
 * Get single order details (Admin)
 */
export async function getAdminOrderById(id: string): Promise<{ success: boolean; order: any }> {
  return apiRequest<{ success: boolean; order: any }>(`/admin/orders/${id}`);
}

/**
 * Update order status (Admin)
 */
export async function updateAdminOrderStatus(id: string, status: string, notes?: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/admin/orders/${id}/status`, {
    method: "PUT",
    data: { status, notes },
  });
}

/**
 * Update payment status (Admin)
 */
export async function updateAdminPaymentStatus(id: string, paymentStatus: string, transactionId?: string, notes?: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/admin/orders/${id}/payment`, {
    method: "PUT",
    data: { paymentStatus, transactionId, notes },
  });
}

/**
 * Delete order (Admin)
 */
export async function deleteAdminOrder(id: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/admin/orders/${id}`, {
    method: "DELETE",
  });
}

export async function updateAddress(addressId: string, addressData: Address): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>(`/user/profile/addresses/${addressId}`, {
    method: "PUT",
    data: addressData,
  });
}

export async function deleteAddress(addressId: string): Promise<UserProfileResponse> {
  return apiRequest<UserProfileResponse>(`/user/profile/addresses/${addressId}`, {
    method: "DELETE",
  });
}

// ========== PAYMENT FUNCTIONS ==========

export async function createPaymentSession(data: { orderId: string; paymentMethod: string }): Promise<PaymentInitResponse> {
  return apiRequest<PaymentInitResponse>("/payment/create-session", {
    method: "POST",
    data,
  });
}

export async function getPaymentStatus(orderId: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/payment/status/${orderId}`, {
    method: "GET",
  });
}

export async function handlePaymentSuccess(paymentData: any): Promise<ApiResponse> {
  return apiRequest<ApiResponse>("/payment/success", {
    method: "POST",
    data: paymentData,
  });
}

export async function handlePaymentFail(paymentData: any): Promise<ApiResponse> {
  return apiRequest<ApiResponse>("/payment/fail", {
    method: "POST",
    data: paymentData,
  });
}

export async function handlePaymentCancel(paymentData: any): Promise<ApiResponse> {
  return apiRequest<ApiResponse>("/payment/cancel", {
    method: "POST",
    data: paymentData,
  });
}

// ========== MOCK PAYMENT FUNCTIONS (for testing) ==========

export async function mockPaymentSuccess(data: { tran_id: string; orderId: string }): Promise<ApiResponse> {
  return apiRequest<ApiResponse>("/payment/mock/success", {
    method: "POST",
    data,
  });
}

export async function mockPaymentFail(data: { tran_id: string; orderId: string; error: string }): Promise<ApiResponse> {
  return apiRequest<ApiResponse>("/payment/mock/fail", {
    method: "POST",
    data,
  });
}

export async function getOrderDetails(orderId: string): Promise<OrderResponse> {
  return apiRequest<OrderResponse>(`/order/${orderId}`);
}

// ================== PASSWORD RESET ==================

export function requestPasswordReset(identifier: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>("/user/forgot-password", {
    method: "POST",
    data: { identifier },
  });
}

export function resetPasswordWithToken(token: string, password: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/user/reset-password-email/${token}`, {
    method: "POST",
    data: { password },
  });
}

export function resetPasswordWithOTP(phone: string, otp: string, password: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>("/user/reset-password-phone", {
    method: "POST",
    data: { phone, otp, password },
  });
}

// ====================================================

/**
 * Get dashboard statistics.
 */
export async function getDashboardStats(): Promise<DashboardStatsResponse> {
  try {
    const res = await api.get<DashboardStatsResponse>("/dashboard/stats");
    return res.data;
  } catch (err: any) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to get dashboard statistics",
    );
  }
}

