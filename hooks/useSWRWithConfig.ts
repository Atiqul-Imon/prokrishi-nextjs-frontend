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
 * Cache: 2 minutes (reduced from 30 minutes)
 */
export function useStaticData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true, // Refetch on tab focus for fresh data
    revalidateOnReconnect: true, // Refetch on reconnect
    dedupingInterval: 120000, // 2 minutes (reduced from 30 minutes)
    refreshInterval: 120000, // Auto-refresh every 2 minutes (reduced from 30 minutes)
  });
}

/**
 * Hook for PRODUCT DATA
 * Use for: Product listings, product details
 * Cache: 1 minute, revalidate on focus
 * Important: Stock levels need to be relatively fresh
 */
export function useProductData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true, // Revalidate when user comes back
    revalidateOnReconnect: true,
    dedupingInterval: 5000, // 5 seconds (reduced from 10 seconds)
    refreshInterval: 60000, // Auto-refresh every 1 minute (reduced from 5 minutes)
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
    dedupingInterval: 1000, // 1 second only (reduced from 2 seconds)
    refreshInterval: 10000, // Refresh every 10 seconds (reduced from 30 seconds)
    revalidateIfStale: true,
  });
}

/**
 * Hook for SEARCH RESULTS
 * Use for: Product search, category filtering
 * Cache: 1 minute, no auto-refresh
 */
export function useSearchData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true, // Revalidate on focus for fresh search results
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute (reduced from 3 minutes)
    refreshInterval: 0, // No auto-refresh for search
  });
}

/**
 * Hook for USER-SPECIFIC data
 * Use for: User profile, addresses, order history
 * Cache: 2 minutes, revalidate on focus
 */
export function useUserData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 10000, // 10 seconds (reduced from 30 seconds)
    refreshInterval: 120000, // Auto-refresh every 2 minutes (reduced from 10 minutes)
  });
}

/**
 * Hook for ADMIN/DASHBOARD data
 * Use for: Admin analytics, reports, inventory
 * Cache: 30 seconds, always revalidate on focus
 */
export function useAdminData<T = any>(key: string | null) {
  return useSWR<T>(key, fetcher, {
    revalidateOnFocus: true, // Admin needs fresh data
    revalidateOnReconnect: true,
    dedupingInterval: 2000, // 2 seconds (reduced from 5 seconds)
    refreshInterval: 30000, // Auto-refresh every 30 seconds (reduced from 2 minutes)
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

