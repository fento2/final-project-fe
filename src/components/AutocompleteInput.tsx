"use client";
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, MapPin, Building2 } from 'lucide-react';
import { useAutocomplete } from '@/hooks/useAutocomplete';

interface AutocompleteInputProps {
  type: 'company-name' | 'company-location';
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
  className?: string;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  type,
  value,
  onChange,
  placeholder,
  label,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    suggestions,
    loading,
    updateQuery,
    clearSuggestions
  } = useAutocomplete(type, {
    minLength: 1,
    maxResults: 8,
    debounceMs: 300
  });

  // Only show suggestions for company-name, not for location
  const shouldShowSuggestions = type === 'company-name';

  // Sync with external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    
    // Only update query and show suggestions for company-name type
    if (shouldShowSuggestions) {
      updateQuery(newValue);
      
      if (newValue.length > 0 && !isOpen) {
        setIsOpen(true);
      }
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onChange(suggestion);
    setIsOpen(false);
    clearSuggestions();
  };

  // Handle clear input
  const handleClear = () => {
    setInputValue('');
    onChange('');
    setIsOpen(false);
    clearSuggestions();
    inputRef.current?.focus();
  };

  // Handle input focus
  const handleFocus = () => {
    if (shouldShowSuggestions && inputValue.length > 0 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  // Handle input blur with delay to allow clicks
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Icon = type === 'company-name' ? Building2 : MapPin;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          autoComplete="off"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {inputValue && (
            <button
              onClick={handleClear}
              className="p-1 mr-1 text-gray-400 hover:text-gray-600"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {shouldShowSuggestions && (
            <div className="p-2">
              <ChevronDown 
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`} 
              />
            </div>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown - Only for company-name */}
      {shouldShowSuggestions && isOpen && (
        <div className="autocomplete-dropdown absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500 flex items-center">
              <div className="autocomplete-loading animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
              Searching...
            </div>
          )}
          
          {!loading && suggestions.length === 0 && inputValue.length > 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              No suggestions found
            </div>
          )}
          
          {!loading && suggestions.length > 0 && (
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleSuggestionClick(suggestion.value)}
                    className="autocomplete-item w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none flex items-center justify-between"
                    type="button"
                  >
                    <div className="flex items-center">
                      <Icon className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span className="truncate">{suggestion.label}</span>
                    </div>
                    {suggestion.count && suggestion.count > 0 && (
                      <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                        ({suggestion.count})
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;