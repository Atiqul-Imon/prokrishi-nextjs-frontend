// app/utils/api.js
// Centralized API utility for Prokrishi frontend (Next.js) using axios and localStorage-based JWT

import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3500/api";

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Optionally redirect to login page
      }
    }
    return Promise.reject(error);
  },
);

/**
 * Universal axios wrapper for API requests.
 * @param {string} path - API path (e.g. "/user/register")
 * @param {object} options - Axios config (method, headers, data, etc.)
 * @returns {Promise<any>} - The parsed JSON response, or throws on error.
 */
export async function apiRequest(path, options = {}) {
  try {
    const res = await api({
      url: path,
      ...options,
    });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "API Error";
    throw new Error(msg);
  }
}

/**
 * Register a new user.
 * @param {object} param0 - { name, email, phone, password }
 */
export async function registerUser({ name, email, phone, password }) {
  const data = await apiRequest("/user/register", {
    method: "POST",
    data: { name, email, phone, password },
  });
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  return data;
}

/**
 * Login user.
 * @param {object} param0 - { email, password }
 */
export async function loginUser({ email, password }) {
  const data = await apiRequest("/user/login", {
    method: "POST",
    data: { email, password },
  });
  if (data.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }
  if (data.refreshToken) {
    localStorage.setItem("refreshToken", data.refreshToken);
  }
  return data;
}

/**
 * Logout user.
 */
export function logoutUser() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  // Optionally, call a backend logout endpoint if you need to blacklist tokens
}

/**
 * Fetch current user profile (requires valid JWT).
 */
export function fetchProfile() {
  return apiRequest("/user/profile", {
    method: "GET",
  });
}

export async function updateUserAddresses(addresses) {
  console.log("API: updateUserAddresses called with:", addresses);
  try {
    const result = await apiRequest("/user/profile", {
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

export async function placeOrder(orderData) {
  return apiRequest("/order/create", {
    method: "POST",
    data: orderData,
  });
}

// Generic GET list
export function getResourceList(resource, query = "") {
  const path = `/${resource}${query ? `?${query}` : ""}`;
  return apiRequest(path, { method: "GET" });
}

// Generic POST (for JSON data)
export function createResource(resource, payload) {
  return apiRequest(`/${resource}`, {
    method: "POST",
    data: payload,
  });
}

// Generic PUT (for JSON data)
export function updateResource(resource, id, payload) {
  return apiRequest(`/${resource}/${id}`, {
    method: "PUT",
    data: payload,
  });
}

// Generic DELETE
export function deleteResource(resource, id) {
  return apiRequest(`/${resource}/${id}`, {
    method: "DELETE",
  });
}

export function getUserById(id) {
  return apiRequest(`/user/${id}`);
}

export function getProductById(id) {
  return apiRequest(`/product/${id}`);
}

export async function getCategoryById(id) {
  return apiRequest(`/category/id/${id}`);
}

// ========== PRODUCT-SPECIFIC (for file/image upload) ==========

/**
 * Create product (with file/image upload).
 * Accepts: { name, category, price, stock, status, description, image }
 * image can be a File or a string (URL).
 */
export async function createProduct(productData) {
  const formData = new FormData();
  for (const key in productData) {
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  }

  try {
    const res = await api.post("/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || "Failed to create product";
    throw new Error(msg);
  }
}

/**
 * Update product (with file/image upload).
 * Accepts: id, product fields as above.
 */
export async function updateProduct(id, productData) {
  const formData = new FormData();
  for (const key in productData) {
    // We don't send the image if it's not a file (i.e., it's a string URL)
    // The backend will keep the old image if a new one isn't sent.
    if (key === "image" && !(productData[key] instanceof File)) {
      continue;
    }
    if (productData[key] !== null && productData[key] !== undefined) {
      formData.append(key, productData[key]);
    }
  }

  try {
    const res = await api.put(`/product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || "Failed to update product";
    throw new Error(msg);
  }
}

/**
 * Get all products.
 * Returns: array of products
 */
export async function getAllProducts() {
  try {
    const res = await api.get("/product");
    return res.data.products;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to get products",
    );
  }
}

/**
 * Search products with filters and pagination.
 * @param {object} params - Search parameters
 * @param {string} params.q - Search query
 * @param {string} params.category - Category filter
 * @param {number} params.minPrice - Minimum price
 * @param {number} params.maxPrice - Maximum price
 * @param {string} params.sortBy - Sort field (name, price, createdAt)
 * @param {string} params.sortOrder - Sort order (asc, desc)
 * @param {number} params.page - Page number
 * @param {number} params.limit - Items per page
 * @param {string} params.status - Product status filter
 * @returns {object} Search results with products, pagination, and filters
 */
export async function searchProducts(params = {}) {
  try {
    const queryParams = new URLSearchParams();

    // Add search parameters
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== "") {
        queryParams.append(key, params[key]);
      }
    });

    const res = await api.get(`/product/search?${queryParams.toString()}`);
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to search products",
    );
  }
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id) {
  return deleteResource("product", id);
}

/**
 * Toggle featured status of a product.
 */
export async function toggleProductFeatured(productId) {
  return apiRequest(`/product/${productId}/toggle-featured`, {
    method: "PATCH",
  });
}

// ========== CATEGORY-SPECIFIC (for file/image upload) ==========

export async function createCategory(category) {
  const formData = new FormData();
  formData.append("name", category.name);
  if (category.description) {
    formData.append("description", category.description);
  }
  if (category.image && category.image instanceof File) {
    formData.append("image", category.image);
  }

  try {
    const res = await api.post("/category/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || "Failed to create category";
    throw new Error(msg);
  }
}

export async function updateCategory(id, category) {
  const formData = new FormData();

  // Only append fields that are provided
  Object.keys(category).forEach((key) => {
    // The image field is handled separately if it's a file
    if (key !== "image") {
      formData.append(key, category[key]);
    }
  });

  if (category.image && category.image instanceof File) {
    formData.append("image", category.image);
  }

  try {
    const res = await api.put(`/category/update/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    const msg =
      err.response?.data?.message || err.message || "Failed to update category";
    throw new Error(msg);
  }
}

export async function deleteCategory(id) {
  return deleteResource("category/delete", id);
}

export async function getFeaturedCategories() {
  return apiRequest("/category/featured");
}

// Address Management
export async function addAddress(addressData) {
  return apiRequest("/user/profile/addresses", {
    method: "POST",
    data: addressData,
  });
}

export async function updateAddress(addressId, addressData) {
  return apiRequest(`/user/profile/addresses/${addressId}`, {
    method: "PUT",
    data: addressData,
  });
}

export async function deleteAddress(addressId) {
  return apiRequest(`/user/profile/addresses/${addressId}`, {
    method: "DELETE",
  });
}

// ========== PAYMENT FUNCTIONS ==========

/**
 * Create payment session with SSL Commerz
 * @param {object} param0 - { orderId, paymentMethod }
 */
export async function createPaymentSession({ orderId, paymentMethod }) {
  return apiRequest("/payment/create-session", {
    method: "POST",
    data: { orderId, paymentMethod },
  });
}

/**
 * Get payment status for an order
 * @param {string} orderId - Order ID
 */
export async function getPaymentStatus(orderId) {
  return apiRequest(`/payment/status/${orderId}`, {
    method: "GET",
  });
}

/**
 * Handle payment success callback
 * @param {object} paymentData - Payment data from SSL Commerz
 */
export async function handlePaymentSuccess(paymentData) {
  return apiRequest("/payment/success", {
    method: "POST",
    data: paymentData,
  });
}

/**
 * Handle payment failure callback
 * @param {object} paymentData - Payment data from SSL Commerz
 */
export async function handlePaymentFail(paymentData) {
  return apiRequest("/payment/fail", {
    method: "POST",
    data: paymentData,
  });
}

/**
 * Handle payment cancel callback
 * @param {object} paymentData - Payment data from callback
 */
export async function handlePaymentCancel(paymentData) {
  return apiRequest("/payment/cancel", {
    method: "POST",
    data: paymentData,
  });
}

// ========== MOCK PAYMENT FUNCTIONS (for testing) ==========

/**
 * Mock payment success (for testing)
 * @param {object} param0 - { tran_id, orderId }
 */
export async function mockPaymentSuccess({ tran_id, orderId }) {
  return apiRequest("/payment/mock/success", {
    method: "POST",
    data: { tran_id, orderId },
  });
}

/**
 * Mock payment failure (for testing)
 * @param {object} param0 - { tran_id, orderId, error }
 */
export async function mockPaymentFail({ tran_id, orderId, error }) {
  return apiRequest("/payment/mock/fail", {
    method: "POST",
    data: { tran_id, orderId, error },
  });
}

export async function getOrderDetails(orderId) {
  return apiRequest(`/order/${orderId}`);
}

// ================== PASSWORD RESET ==================

export function requestPasswordReset(identifier) {
    return apiRequest("/user/forgot-password", {
        method: "POST",
        data: { identifier },
    });
}

export function resetPasswordWithToken(token, password) {
    return apiRequest(`/user/reset-password-email/${token}`, {
        method: "POST",
        data: { password },
    });
}

export function resetPasswordWithOTP(phone, otp, password) {
    return apiRequest("/user/reset-password-phone", {
        method: "POST",
        data: { phone, otp, password },
    });
}

// ====================================================

/**
 * Get dashboard statistics.
 * Returns: object with stats, recentOrders, and lowStockProducts
 */
export async function getDashboardStats() {
  try {
    const res = await api.get("/dashboard/stats");
    return res.data;
  } catch (err) {
    throw new Error(
      err.response?.data?.message || err.message || "Failed to get dashboard statistics",
    );
  }
}
