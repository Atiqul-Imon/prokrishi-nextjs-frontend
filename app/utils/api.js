// app/utils/api.js
// Centralized API utility for Prokrishi frontend (Next.js) using axios and localStorage-based JWT

import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3500/api";

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
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401/403, auto-logout (optional), extract tokens, etc.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        // Optionally redirect to login page
      }
    }
    return Promise.reject(error);
  }
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
    const msg =
      err.response?.data?.message ||
      err.message ||
      "API Error";
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
  return apiRequest("/user/profile", {
    method: "PUT",
    data: { addresses },
  });
}


export async function placeOrder(order) {
  return apiRequest("/order/create", {
    method: "POST",
    data: order,
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

// ========== PRODUCT-SPECIFIC (for file/image upload) ==========

/**
 * Create product (with file/image upload).
 * Accepts: { name, category, price, stock, status, description, image }
 * image can be a File or a string (URL).
 */
export async function createProduct(product) {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("category", product.category);
  formData.append("price", product.price);
  formData.append("stock", product.stock);
  formData.append("status", product.status);
  formData.append("description", product.description);

  if (product.image && product.image instanceof File) {
    formData.append("image", product.image);
  } else if (typeof product.image === "string" && product.image !== "") {
    formData.append("image", product.image);
  }

  try {
    const res = await api.post("/product/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to create product";
    throw new Error(msg);
  }
}

/**
 * Update product (with file/image upload).
 * Accepts: id, product fields as above.
 */
export async function updateProduct(id, product) {
  const formData = new FormData();
  formData.append("name", product.name);
  formData.append("category", product.category);
  formData.append("price", product.price);
  formData.append("stock", product.stock);
  formData.append("status", product.status);
  formData.append("description", product.description);

  if (product.image && product.image instanceof File) {
    formData.append("image", product.image);
  } else if (typeof product.image === "string" && product.image !== "") {
    formData.append("image", product.image);
  }

  try {
    const res = await api.put(`/product/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data.product;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to update product";
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
    const msg = err.response?.data?.message || err.message || "Failed to fetch products";
    throw new Error(msg);
  }
}

/**
 * Get a single product by ID.
 */
export async function getProductById(id) {
  try {
    const res = await api.get(`/product/${id}`);
    return res.data.product;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to fetch product";
    throw new Error(msg);
  }
}

/**
 * Delete a product by ID.
 */
export async function deleteProduct(id) {
  try {
    const res = await api.delete(`/product/${id}`);
    return res.data;
  } catch (err) {
    const msg = err.response?.data?.message || err.message || "Failed to delete product";
    throw new Error(msg);
  }
}