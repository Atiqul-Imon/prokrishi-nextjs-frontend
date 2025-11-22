import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3500';

const fishApi = axios.create({
  baseURL: `${API_BASE_URL}/api/fish`,
  withCredentials: true,
});

// Add request interceptor to include auth token
fishApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
fishApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Only redirect if not already in dashboard (dashboard layout handles auth)
      const isDashboardRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard');
      const isLoginRoute = typeof window !== 'undefined' && window.location.pathname.includes('/login');
      
      // Don't redirect or clear tokens if we're in dashboard - let the dashboard layout handle it
      if (isDashboardRoute) {
        // Just reject the error, don't redirect or clear tokens
        return Promise.reject(error);
      }
      
      if (!isLoginRoute) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Fish Products API
export const fishProductApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    isFeatured?: boolean;
    category?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) => {
    const response = await fishApi.get('/products', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await fishApi.get(`/products/${id}`);
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await fishApi.post('/products', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await fishApi.put(`/products/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await fishApi.delete(`/products/${id}`);
    return response.data;
  },

  toggleFeatured: async (id: string) => {
    const response = await fishApi.patch(`/products/${id}/featured`);
    return response.data;
  },
};


// Fish Orders API
export const fishOrderApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
  }) => {
    const response = await fishApi.get('/orders', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await fishApi.get(`/orders/${id}`);
    return response.data;
  },

  create: async (data: {
    orderItems: Array<{
      fishProduct: string;
      sizeCategoryId: string;
      requestedWeight: number;
      notes?: string;
    }>;
    shippingAddress: {
      name: string;
      phone: string;
      address: string;
      division?: string;
      district?: string;
      upazila?: string;
      postalCode?: string;
    };
    paymentMethod?: string;
    totalPrice: number;
    guestInfo?: {
      name: string;
      email?: string;
      phone: string;
    };
    notes?: string;
  }) => {
    const response = await fishApi.post('/orders', data);
    return response.data;
  },

  updateStatus: async (id: string, data: {
    status?: string;
    paymentStatus?: string;
    notes?: string;
    cancellationReason?: string;
  }) => {
    const response = await fishApi.put(`/orders/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await fishApi.delete(`/orders/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await fishApi.get('/orders/stats');
    return response.data;
  },
};

export default fishApi;

