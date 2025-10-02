"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import AutocompleteInput from "@/components/AutocompleteInput";
import { useDebounce } from "@/hooks/useDebounce";

export interface CompanyFilters {
    name: string;
    location: string;
}

interface CompaniesFilterSectionProps {
    filters: CompanyFilters;
    onChange: (filters: CompanyFilters) => void;
    onSearch: () => void;
    loading: boolean;
    resultCount: number;
}

const CompaniesFilterSection: React.FC<CompaniesFilterSectionProps> = ({
    filters,
    onChange,
    onSearch,
    loading,
    resultCount
}) => {
    const [localFilters, setLocalFilters] = useState(filters);
    
    // Debounce the filter changes to avoid too many API calls
    const debouncedFilters = useDebounce(localFilters, 500);

    // Sync local filters with props
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Trigger search when debounced filters change
    useEffect(() => {
        // Only trigger if there's actually a change from the debounced value
        if (JSON.stringify(debouncedFilters) !== JSON.stringify(filters)) {
            onChange(debouncedFilters);
        }
    }, [debouncedFilters, onChange, filters]);

    const handleInputChange = (field: keyof CompanyFilters, value: string) => {
        const newFilters = { ...localFilters, [field]: value };
        setLocalFilters(newFilters);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSearch();
        }
    };

    const handleClear = () => {
        const clearedFilters = { name: "", location: "" };
        setLocalFilters(clearedFilters);
        onChange(clearedFilters);
    };

    const handleInstantSearch = () => {
        onChange(localFilters);
        onSearch();
    };

    return (
        <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Companies</h3>
            
            {/* Company Name Filter with Autocomplete */}
            <div className="mb-4">
                <AutocompleteInput
                    type="company-name"
                    value={localFilters.name}
                    onChange={(value: string) => handleInputChange("name", value)}
                    placeholder="Search by company name..."
                    label="Company Name"
                />
            </div>

            {/* Location Filter with Autocomplete */}
            <div className="mb-6">
                <AutocompleteInput
                    type="company-location"
                    value={localFilters.location}
                    onChange={(value: string) => handleInputChange("location", value)}
                    placeholder="City or location..."
                    label="Location"
                />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
                <Button
                    onClick={handleInstantSearch}
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                    onKeyPress={handleKeyPress}
                >
                    <Search className="w-4 h-4 mr-2" />
                    {loading ? "Searching..." : "Search"}
                </Button>
                <Button
                    onClick={handleClear}
                    variant="outline"
                    className="px-4"
                    disabled={loading}
                >
                    Clear
                </Button>
            </div>

            {/* Auto-search indicator */}
            {JSON.stringify(debouncedFilters) !== JSON.stringify(localFilters) && (
                <div className="text-xs text-indigo-600 text-center mb-2 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600 mr-1"></div>
                    Auto-searching...
                </div>
            )}

            {/* Results Count */}
            <div className="text-sm text-gray-600 text-center">
                {loading ? "Loading..." : `${resultCount} companies found`}
            </div>
        </div>
    );
};

export default CompaniesFilterSection;