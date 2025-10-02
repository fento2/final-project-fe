import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '@/helper/apiCall';

interface AutocompleteOptions {
  minLength?: number;
  maxResults?: number;
  debounceMs?: number;
}

interface AutocompleteSuggestion {
  value: string;
  label: string;
  count?: number;
}

/**
 * Custom hook for autocomplete functionality
 * Uses the same /company/find endpoint as the companies page for consistency
 */
export function useAutocomplete(
  type: 'company-name' | 'company-location',
  options: AutocompleteOptions = {}
) {
  const {
    minLength = 2,
    maxResults = 10,
    debounceMs = 300
  } = options;

  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < minLength) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      // Use the same endpoint as companies page: /company/find
      const params = new URLSearchParams();
      
      if (type === 'company-name') {
        params.set('name', searchQuery);
      } else if (type === 'company-location') {
        params.set('location', searchQuery);
      }
      
      // Limit results for better performance
      params.set('limit', (maxResults * 2).toString()); // Get more data for better filtering

      const response = await apiCall.get(`/company/find?${params.toString()}`);
      const companies = response.data?.data?.data || [];
      
      // Extract unique values and create suggestions
      const uniqueValues = new Map<string, number>();
      
      companies.forEach((company: any) => {
        let value: string;
        
        if (type === 'company-name') {
          value = company.name || '';
        } else {
          // For location, try different possible fields in order of preference
          value = company.location || 
                  company.address || 
                  company.city || 
                  company.state || 
                  company.country || 
                  '';
        }
        
        // Only include non-empty values that match the search query
        if (value && value.trim() && value.toLowerCase().includes(searchQuery.toLowerCase())) {
          const count = uniqueValues.get(value) || 0;
          uniqueValues.set(value, count + 1);
        }
      });

      // Convert to suggestions array
      const suggestions: AutocompleteSuggestion[] = Array.from(uniqueValues.entries())
        .map(([value, count]) => ({
          value,
          label: value,
          count
        }));

      // Sort by relevance (starts with query first, then contains, then by count)
      suggestions.sort((a, b) => {
        const queryLower = searchQuery.toLowerCase();
        const aLower = a.value.toLowerCase();
        const bLower = b.value.toLowerCase();
        
        const aStartsWith = aLower.startsWith(queryLower);
        const bStartsWith = bLower.startsWith(queryLower);
        
        if (aStartsWith && !bStartsWith) return -1;
        if (!aStartsWith && bStartsWith) return 1;
        
        // If both start with or both don't start with, sort by count then alphabetically
        const aCount = a.count || 0;
        const bCount = b.count || 0;
        if (aCount !== bCount) return bCount - aCount;
        return a.value.localeCompare(b.value);
      });

      setSuggestions(suggestions.slice(0, maxResults));
    } catch (error) {

      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [type, minLength, maxResults]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [query, fetchSuggestions, debounceMs]);

  const updateQuery = useCallback((newQuery: string) => {
    setQuery(newQuery);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    loading,
    updateQuery,
    clearSuggestions,
    query
  };
}