"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSearchSuggestions, usePopularSearches, SearchSuggestion } from "@/hooks/useSearchSuggestions";
import { HeroContent } from "./hero/HeroContent";
import { SearchForm } from "./hero/SearchForm";
import { PopularSearches } from "./hero/PopularSearches";
import { useUserRole } from "./hero/hooks/useUserRole";
import { useClickOutside } from "./hero/hooks/useClickOutside";
import { useKeyboardNavigation } from "./hero/hooks/useKeyboardNavigation";
import { createSearchQuery, scrollToSearchResults, handleSuggestionLogic } from "./hero/utils/searchHelpers";

const HeroSection = () => {
    const router = useRouter();
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    
    // Suggestion states
    const [showKeywordSuggestions, setShowKeywordSuggestions] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [selectedKeywordIndex, setSelectedKeywordIndex] = useState(-1);
    const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);
    const keywordRef = useRef<HTMLDivElement>(null);
    const locationRef = useRef<HTMLDivElement>(null);

    // Hooks
    const { isCompanyUser } = useUserRole();
    const { suggestions: keywordSuggestions } = useSearchSuggestions(keyword, 'all');
    const { suggestions: locationSuggestions } = useSearchSuggestions(location, 'location');
    const { popularSearches } = usePopularSearches();

    // Close dropdowns when clicking outside
    useClickOutside(
        [keywordRef, locationRef],
        [
            () => setShowKeywordSuggestions(false),
            () => setShowLocationSuggestions(false)
        ]
    );

    const handleSuggestionSelect = (suggestion: SearchSuggestion, field: 'keyword' | 'location') => {
        const { keyword: newKeyword, location: newLocation } = 
            handleSuggestionLogic(suggestion, field, keyword, location);
        
        setKeyword(newKeyword);
        setLocation(newLocation);

        if (field === 'keyword') {
            setShowKeywordSuggestions(false);
            setSelectedKeywordIndex(-1);
        } else {
            setShowLocationSuggestions(false);
            setSelectedLocationIndex(-1);
        }
    };

    // Keyboard navigation
    const { handleKeywordKeyDown, handleLocationKeyDown } = useKeyboardNavigation({
        keyword,
        location,
        keywordSuggestions,
        locationSuggestions,
        showKeywordSuggestions,
        showLocationSuggestions,
        selectedKeywordIndex,
        selectedLocationIndex,
        setSelectedKeywordIndex,
        setSelectedLocationIndex,
        setShowKeywordSuggestions,
        setShowLocationSuggestions,
        handleSuggestionSelect
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowKeywordSuggestions(false);
        setShowLocationSuggestions(false);
        const q = createSearchQuery(keyword, location);
        router.push(`/?${q}`);
        scrollToSearchResults();
    };

    const handlePopularSearchClick = (searchKeyword: string) => {
        setKeyword(searchKeyword);
        const q = createSearchQuery(searchKeyword, location);
        router.push(`/?${q}`);
        scrollToSearchResults();
    };

    const handleKeywordSuggestionClick = (suggestion: SearchSuggestion) => {
        handleSuggestionSelect(suggestion, 'keyword');
        
        setTimeout(() => {
            const { keyword: searchKeyword, location: searchLocation } = 
                handleSuggestionLogic(suggestion, 'keyword', keyword, location);
            
            const q = createSearchQuery(searchKeyword, searchLocation);
            router.push(`/?${q}`);
            scrollToSearchResults();
        }, 100);
    };

    const handleLocationSuggestionClick = (suggestion: SearchSuggestion) => {
        handleSuggestionSelect(suggestion, 'location');
        
        setTimeout(() => {
            const searchLocation = suggestion.value;
            const q = createSearchQuery(keyword, searchLocation);
            router.push(`/?${q}`);
            scrollToSearchResults();
        }, 100);
    };

    return (
        <section className="w-screen min-h-[600px] md:min-h-[700px] lg:min-h-screen flex items-center justify-center bg-white -mt-6 md:-mt-12">
            <div className="relative max-w-[1200px] w-full flex flex-col items-center rounded-[32px] md:rounded-[48px] overflow-hidden shadow-lg bg-white md:scale-[1.15] min-h-[520px] md:min-h-[700px] lg:min-h-[700px]">
                {/* Background image */}
                <img
                    src="/images/bg_hero.jpg"
                    alt="hero background"
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
                {/* Overlay for soft white effect*/}
                <div className="absolute inset-0 bg-white/20 z-10" />

                <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4 sm:px-6 py-12 sm:py-16 md:py-20">
                    <HeroContent isCompanyUser={isCompanyUser()} />
                    
                    <SearchForm
                        keyword={keyword}
                        location={location}
                        keywordSuggestions={keywordSuggestions}
                        locationSuggestions={locationSuggestions}
                        showKeywordSuggestions={showKeywordSuggestions}
                        showLocationSuggestions={showLocationSuggestions}
                        selectedKeywordIndex={selectedKeywordIndex}
                        selectedLocationIndex={selectedLocationIndex}
                        onKeywordChange={(value) => {
                            setKeyword(value);
                            setShowKeywordSuggestions(true);
                            setSelectedKeywordIndex(-1);
                        }}
                        onLocationChange={(value) => {
                            setLocation(value);
                            setShowLocationSuggestions(true);
                            setSelectedLocationIndex(-1);
                        }}
                        onKeywordFocus={() => setShowKeywordSuggestions(true)}
                        onLocationFocus={() => setShowLocationSuggestions(true)}
                        onKeywordKeyDown={handleKeywordKeyDown}
                        onLocationKeyDown={handleLocationKeyDown}
                        onKeywordSuggestionClick={handleKeywordSuggestionClick}
                        onLocationSuggestionClick={handleLocationSuggestionClick}
                        onSubmit={handleSubmit}
                        keywordRef={keywordRef}
                        locationRef={locationRef}
                    />

                    <PopularSearches
                        popularSearches={popularSearches}
                        onSearchClick={handlePopularSearchClick}
                    />
                </div>
            </div>
        </section>
    );
};

export default HeroSection;