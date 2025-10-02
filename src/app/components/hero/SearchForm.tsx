import React from "react";
import { Search, MapPin } from "lucide-react";
import SuggestionDropdown from "@/components/ui/SuggestionDropdown";
import { SearchSuggestion } from "@/hooks/useSearchSuggestions";

interface SearchFormProps {
    keyword: string;
    location: string;
    keywordSuggestions: SearchSuggestion[];
    locationSuggestions: SearchSuggestion[];
    showKeywordSuggestions: boolean;
    showLocationSuggestions: boolean;
    selectedKeywordIndex: number;
    selectedLocationIndex: number;
    onKeywordChange: (value: string) => void;
    onLocationChange: (value: string) => void;
    onKeywordFocus: () => void;
    onLocationFocus: () => void;
    onKeywordKeyDown: (e: React.KeyboardEvent) => void;
    onLocationKeyDown: (e: React.KeyboardEvent) => void;
    onKeywordSuggestionClick: (suggestion: SearchSuggestion) => void;
    onLocationSuggestionClick: (suggestion: SearchSuggestion) => void;
    onSubmit: (e: React.FormEvent) => void;
    keywordRef: React.RefObject<HTMLDivElement | null>;
    locationRef: React.RefObject<HTMLDivElement | null>;
}

export const SearchForm: React.FC<SearchFormProps> = ({
    keyword,
    location,
    keywordSuggestions,
    locationSuggestions,
    showKeywordSuggestions,
    showLocationSuggestions,
    selectedKeywordIndex,
    selectedLocationIndex,
    onKeywordChange,
    onLocationChange,
    onKeywordFocus,
    onLocationFocus,
    onKeywordKeyDown,
    onLocationKeyDown,
    onKeywordSuggestionClick,
    onLocationSuggestionClick,
    onSubmit,
    keywordRef,
    locationRef
}) => {
    return (
        <form onSubmit={onSubmit} className="flex flex-col md:flex-row items-center w-full max-w-5xl gap-3 sm:gap-4 mb-8 px-2">
            {/* Keyword Search with Suggestions */}
            <div ref={keywordRef} className="relative w-full md:w-[520px]">
                <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full border border-gray-200">
                    <Search className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="What job are you looking for?"
                        value={keyword}
                        onChange={(e) => onKeywordChange(e.target.value)}
                        onFocus={onKeywordFocus}
                        onKeyDown={onKeywordKeyDown}
                        className="w-full outline-none bg-transparent text-sm sm:text-base"
                    />
                </div>
                <SuggestionDropdown
                    suggestions={keywordSuggestions}
                    onSelect={onKeywordSuggestionClick}
                    isVisible={showKeywordSuggestions && keyword.length >= 2}
                    selectedIndex={selectedKeywordIndex}
                />
            </div>

            {/* Location Input with Suggestions */}
            <div ref={locationRef} className="relative w-full md:w-[280px]">
                <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full border border-gray-200">
                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Location (city, country)"
                        value={location}
                        onChange={(e) => onLocationChange(e.target.value)}
                        onFocus={onLocationFocus}
                        onKeyDown={onLocationKeyDown}
                        className="w-full outline-none bg-transparent text-sm sm:text-base"
                    />
                </div>
                <SuggestionDropdown
                    suggestions={locationSuggestions}
                    onSelect={onLocationSuggestionClick}
                    isVisible={showLocationSuggestions && location.length >= 2}
                    selectedIndex={selectedLocationIndex}
                />
            </div>

            <button
                type="submit"
                className="bg-[#4F46E5] text-white font-semibold rounded-lg px-8 py-2 shadow hover:bg-[#4338CA] transition"
            >
                Search
            </button>
        </form>
    );
};