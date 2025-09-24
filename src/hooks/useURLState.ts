import { useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface UseURLStateOptions<T> {
  defaultValues: T;
  serialize: (value: T) => URLSearchParams;
  deserialize: (params: URLSearchParams) => T;
  debounceMs?: number;
}

/**
 * Custom hook for managing state synchronized with URL parameters
 * @param options - Configuration for URL state management
 * @returns Object with current state and update function
 */
export function useURLState<T extends Record<string, any>>(
  options: UseURLStateOptions<T>
) {
  const { defaultValues, serialize, deserialize, debounceMs = 0 } = options;
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Deserialize URL parameters to state
  const getStateFromURL = useCallback((): T => {
    if (!searchParams) return defaultValues;
    return deserialize(searchParams);
  }, [searchParams, defaultValues, deserialize]);

  // Update URL with new state
  const updateURL = useCallback((newState: T) => {
    const params = serialize(newState);
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    const currentUrl = `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`;
    
    if (newUrl !== currentUrl) {
      router.replace(newUrl, { scroll: false });
    }
  }, [pathname, searchParams, router, serialize]);

  // Debounced URL update
  const debouncedUpdateURL = useCallback(
    debounceMs > 0 
      ? debounce(updateURL, debounceMs)
      : updateURL,
    [updateURL, debounceMs]
  );

  return {
    state: getStateFromURL(),
    updateURL: debouncedUpdateURL,
    currentURL: `${pathname}${searchParams ? `?${searchParams.toString()}` : ''}`
  };
}

// Simple debounce implementation
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility functions for common use cases
export const createCompanyFiltersURLState = (defaultFilters: { name: string; location: string }) => ({
  defaultValues: defaultFilters,
  serialize: (filters: { name: string; location: string }) => {
    const params = new URLSearchParams();
    if (filters.name.trim()) params.set('name', filters.name.trim());
    if (filters.location.trim()) params.set('location', filters.location.trim());
    return params;
  },
  deserialize: (params: URLSearchParams) => ({
    name: params.get('name') || '',
    location: params.get('location') || ''
  })
});

export const createPaginationURLState = (defaultPage: number = 1) => ({
  defaultValues: { page: defaultPage },
  serialize: (state: { page: number }) => {
    const params = new URLSearchParams();
    if (state.page > 1) params.set('page', state.page.toString());
    return params;
  },
  deserialize: (params: URLSearchParams) => ({
    page: parseInt(params.get('page') || '1', 10)
  })
});