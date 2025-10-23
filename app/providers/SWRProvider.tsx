'use client';

import { SWRConfig } from 'swr';
import { ReactNode } from 'react';
import { apiRequest } from '@/app/utils/api';

interface SWRProviderProps {
  children: ReactNode;
}

// Smart fetcher that handles different response structures
const fetcher = async (url: string) => {
  try {
    const data = await apiRequest(url);
    return data;
  } catch (error: any) {
    console.error('SWR Fetch Error:', error);
    
    // Handle specific error types
    if (error.message?.includes('timeout')) {
      console.warn('Request timeout, will retry automatically');
    } else if (error.message?.includes('Network error')) {
      console.warn('Network error, will retry automatically');
    }
    
    throw error;
  }
};

export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig 
      value={{
        fetcher,
        
        // Smart E-commerce Configuration
        // Balance between performance and data freshness
        
        revalidateOnFocus: true, // Refresh when user returns to tab (important for stock levels)
        revalidateOnReconnect: true, // Refresh when internet reconnects
        revalidateIfStale: true, // Revalidate stale data on mount
        
        // Deduplication: Prevent duplicate requests within 5 seconds
        dedupingInterval: 5000,
        
        // Focus throttle: Don't revalidate more than once per 20 seconds when refocusing
        focusThrottleInterval: 20000,
        
        // Error handling
        errorRetryCount: 3, // Retry failed requests three times
        errorRetryInterval: 2000, // Wait 2 seconds between retries
        shouldRetryOnError: true,
        
        // Loading timeout - increased for better reliability
        loadingTimeout: 15000, // 15 seconds timeout
        
        // Cache provider - use Map for better performance
        provider: () => new Map(),
        
        // Compare function for data changes
        compare: (a, b) => {
          // Deep equality check for better cache hits
          return JSON.stringify(a) === JSON.stringify(b);
        },
        
        // Error handler
        onError: (error, key) => {
          console.error(`SWR Error for ${key}:`, error);
          
          // Could integrate with error tracking service here
          if (error?.message?.includes('401') || error?.message?.includes('403')) {
            // Handle authentication errors
            console.warn('Authentication error detected');
          }
        },
        
        // Success handler for debugging (remove in production)
        onSuccess: (data, key) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(`✅ SWR Cache Hit/Update for: ${key}`);
          }
        },
        
        // Keep previous data while revalidating (prevents UI flash)
        keepPreviousData: true,
      }}
    >
      {children}
    </SWRConfig>
  );
}

