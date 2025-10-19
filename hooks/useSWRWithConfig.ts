/**
 * Custom SWR hooks with smart configurations for different data types
 * Optimized for e-commerce use cases
 */

import useSWR, { SWRConfiguration } from 'swr';
import { apiRequest } from '@/app/utils/api';

// Default fetcher
const fetcher = (url: string) => apiRequest(url);

/**
 * Hook for STATIC/RARELY CHANGING data
 * Use for: Featured products, categories, site content
 * Cache: 30 minutes
 */
export function useStaticData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: false, // Don't refetch on tab focus
    revalidateOnReconnect: false, // Don't refetch on reconnect
    dedupingInterval: 1800000, // 30 minutes
    refreshInterval: 1800000, // Auto-refresh every 30 minutes
  });
}

/**
 * Hook for PRODUCT DATA
 * Use for: Product listings, product details
 * Cache: 5 minutes, revalidate on focus
 * Important: Stock levels need to be relatively fresh
 */
export function useProductData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true, // Revalidate when user comes back
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10 seconds
    refreshInterval: 300000, // Auto-refresh every 5 minutes
    compare: (a, b) => {
      // Special comparison for products (check stock changes)
      if (a && b && typeof a === 'object' && typeof b === 'object') {
        return JSON.stringify(a) === JSON.stringify(b);
      }
      return a === b;
    }
  });
}

/**
 * Hook for DYNAMIC/REAL-TIME data
 * Use for: Cart, checkout, order status, user balance
 * Cache: Minimal, always fetch fresh
 */
export function useDynamicData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true, // Always revalidate
    revalidateOnReconnect: true,
    dedupingInterval: 2000, // 2 seconds only
    refreshInterval: 30000, // Refresh every 30 seconds
    revalidateIfStale: true,
  });
}

/**
 * Hook for SEARCH RESULTS
 * Use for: Product search, category filtering
 * Cache: 3 minutes, no auto-refresh
 */
export function useSearchData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: false, // Search results don't need focus revalidation
    revalidateOnReconnect: false,
    dedupingInterval: 180000, // 3 minutes
    refreshInterval: 0, // No auto-refresh for search
  });
}

/**
 * Hook for USER-SPECIFIC data
 * Use for: User profile, addresses, order history
 * Cache: 10 minutes, revalidate on focus
 */
export function useUserData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 30000, // 30 seconds
    refreshInterval: 600000, // Auto-refresh every 10 minutes
  });
}

/**
 * Hook for ADMIN/DASHBOARD data
 * Use for: Admin analytics, reports, inventory
 * Cache: 2 minutes, always revalidate on focus
 */
export function useAdminData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true, // Admin needs fresh data
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // 5 seconds
    refreshInterval: 120000, // Auto-refresh every 2 minutes
    errorRetryCount: 3,
  });
}

/**
 * Hook for IMMUTABLE data (won't change)
 * Use for: Historical orders, completed transactions
 * Cache: Forever (or until page reload)
 */
export function useImmutableData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: Infinity,
    refreshInterval: 0,
  });
}

/**
 * Utility: Preload data (prefetch)
 * Use before navigation to make next page instant
 */
export function preloadData(key: string) {
  return fetcher(key);
}

/**
 * Utility: Clear specific cache
 */
export function clearCache(key: string) {
  import('swr').then(({ mutate }) => {
    mutate(key, undefined, { revalidate: true });
  });
}

/**
 * Utility: Update cache without revalidation (optimistic update)
 */
export function updateCache<T>(key: string, data: T) {
  import('swr').then(({ mutate }) => {
    mutate(key, data, { revalidate: false });
  });
}

